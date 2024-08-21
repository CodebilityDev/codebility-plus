import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormikContext } from "formik";
import { service_FormValuesT } from "@/types/protectedroutes";

const ImageUploader = ({ name }: { name: string }) => {
    const { setFieldValue } = useFormikContext<service_FormValuesT>()

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
          if (acceptedFiles.length > 0) {
            setFieldValue(name, acceptedFiles[0]);
          } else {
            setFieldValue(name, null);
          }
        },
        [setFieldValue, name]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
    })

    return (
        <div
            {...getRootProps()}
            className="flex h-24 flex-col items-center justify-center rounded-[5px] border border-[#3F3F46] bg-light-900 font-light text-black-100 dark:bg-dark-100  dark:text-white"
        >
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the files here ...</p> : <p>Click to browse a file</p>}
        </div>
    )
  }

  export default ImageUploader