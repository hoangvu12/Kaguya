import JSONEditor, { JSONEditorOptions } from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
import React, { useEffect, useRef } from "react";

interface JSONEditorProps extends JSONEditorOptions {
  data: object | object[];
}

const JSONEditorComponent: React.FC<JSONEditorProps> = (props) => {
  const { data, ...options } = props;
  const [editor, setEditor] = React.useState<JSONEditor>();
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    if (editor) {
      editor.set(data);

      return;
    }

    const importJSONEditor = async () => {
      const { default: Editor } = await import("jsoneditor");

      const editor = new Editor(ref.current, options);
      setEditor(editor);
      editor.set(data);
    };

    importJSONEditor();

    return () => {
      editor?.destroy();
    };
  }, [data, editor, options]);

  return <div ref={ref} />;
};

export default React.memo(JSONEditorComponent);
