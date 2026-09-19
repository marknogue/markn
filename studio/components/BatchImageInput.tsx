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

export function BatchImageInput(props: ArrayOfObjectsInputProps) {
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

          const assets = await Promise.all(
            slice.map((file) =>
              client.assets.upload("image", file, { filename: file.name })
            )
          );

          onChange(
            insert(
              assets.map((asset) => ({
                _type: "image",
                _key: newKey(),
                asset: { _type: "reference", _ref: asset._id },
              })),
              "after",
              [-1]
            )
          );
        }
        setStatus(
          `Added ${files.length} image${files.length === 1 ? "" : "s"}.`
        );
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
    <Stack space={3}>
      {props.renderDefault(props)}
      <Card padding={3} radius={2} tone="primary" border>
        <Stack space={3}>
          <Text size={1} muted>
            Upload many at once — select multiple images and they&rsquo;ll be
            added in batches of {BATCH_SIZE} to stay within rate limits. Existing
            images are kept; new ones are appended at the end.
          </Text>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              handleFiles(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
          />
          <Button
            text={busy ? "Uploading…" : "Upload multiple images"}
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
}
