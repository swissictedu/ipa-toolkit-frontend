type ImportContainerProps = {
  selection: Record<string, string | number>[];
};

export default function ImportContainer({ selection }: ImportContainerProps) {
  return <div>{selection.length}</div>;
}
