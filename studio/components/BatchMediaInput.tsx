import { Button, Card, Stack, Text } from "@sanity/ui";
import { useCallback, useRef, useState } from "react";
import {
  type ArrayOfObjectsInputProps,
  insert,
  setIfMissing,
  useClient,
} from "sanity";

const BATCH_SIZE = 5;

let counter = 0;
function newKey() {
  counter += 1;
  return `${Date.now().toString(36)}${counter.toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

const isVideo = (file: File) => file.type.startsWith("video/");

async function readImageSize(file: File) {
  return new Promise<{ width?: number; height?: number }>((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

async function readVideoSize(file: File) {
  return new Promise<{ width?: number; height?: number }>((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };
    video.src = url;
  });
}

export function createBatchMediaInput(itemType: string) {
  return function BatchMediaInput(props: ArrayOfObjectsInputProps) {
    const { onChange } = props;
    const client = useClient({ apiVersion: "2024-10-01" });
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleFiles = useCallback(
      async (fileList: FileList | null) => {
        const files = Array.from(fileList ?? []);
        if (!files.length) return;

        setBusy(true);
        onChange(setIfMissing([]));

        try {
          for (let i = 0; i < files.length; i += BATCH_SIZE) {
            const slice = files.slice(i, i + BATCH_SIZE);
            setStatus(
              `Uploading ${Math.min(i + BATCH_SIZE, files.length)} / ${files.length}…`
            );

            const items = await Promise.all(
              slice.map(async (file) => {
                const video = isVideo(file);
                const [asset, size] = await Promise.all([
                  client.assets.upload(video ? "file" : "image", file, {
                    filename: file.name,
                  }),
                  video ? readVideoSize(file) : readImageSize(file),
                ]);
                const ref = { _type: "reference", _ref: asset._id };
                return {
                  _type: itemType,
                  _key: newKey(),
                  type: video ? "video" : "image",
                  width: size.width,
                  height: size.height,
                  landscape: !!(size.width && size.height && size.width > size.height),
                  ...(video
                    ? { video: { _type: "file", asset: ref } }
                    : { image: { _type: "image", asset: ref } }),
                };
              })
            );

            onChange(insert(items, "after", [-1]));
          }
          setStatus(`Added ${files.length} item${files.length === 1 ? "" : "s"}.`);
        } catch (err) {
          setStatus(
            `Upload failed: ${err instanceof Error ? err.message : "unknown error"}`
          );
        } finally {
          setBusy(false);
        }
      },
      [client, onChange]
    );

    return (
      <Stack gap={3}>
        {props.renderDefault(props)}
        <Card padding={3} radius={2} tone="primary" border>
          <Stack gap={3}>
            <Text size={1} muted>
              Select many images and videos at once. They upload in batches of{" "}
              {BATCH_SIZE}, are added to the end of the list, and keep their size
              and orientation. Drag any item afterwards to change the order.
            </Text>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={(event) => {
                handleFiles(event.currentTarget.files);
                event.currentTarget.value = "";
              }}
            />
            <Button
              text={busy ? "Uploading…" : "Upload multiple files"}
              tone="primary"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            />
            {status && (
              <Text size={1} muted>
                {status}
              </Text>
            )}
          </Stack>
        </Card>
      </Stack>
    );
  };
}
