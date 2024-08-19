"use client"
import React from "react"
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik"
import toast, { Toaster } from "react-hot-toast"
import * as Yup from "yup"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import H1 from "@/Components/shared/dashboard/H1"
import { useRouter } from "next/navigation"

export default function AddNewService() {
  return (
    <div className="flex flex-col gap-4 text-white">
      <AddNewServiceForm />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

interface FormValues {
  name: string
  category: string
  postBody: string
  mainImage: File | null
  picture1: File | null
  picture2: File | null
}

const initialValues: FormValues = {
  name: "",
  category: "",
  postBody: "",
  mainImage: null,
  picture1: null,
  picture2: null,
}

const ImageUploader: React.FC<{ name: string }> = ({ name }) => {
  const { setFieldValue } = useFormikContext<FormValues>()
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      setFieldValue(name, acceptedFiles[0])
    },
    [setFieldValue, name]
  )

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

interface IInputLabelProps {
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}

const InputLabel: React.FC<IInputLabelProps> = ({ htmlFor, required = true, children }) => {
  return (
    <label htmlFor={htmlFor} className="font-light">
      {children}
      {required && <span className="ml-1 text-[#FF4242]">*</span>}
    </label>
  )
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name Required"),
  category: Yup.string().required("Category Required"),
  postBody: Yup.string().required("Post Body Required"),
  mainImage: Yup.mixed().required("Required"),
  picture1: Yup.mixed().required("Required"),
  picture2: Yup.mixed().required("Required"),
})

const AddNewServiceForm: React.FC = () => {
  const router = useRouter()

  const handleSubmit = async (values: any, actions: any) => {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("category", values.category)
      formData.append("postBody", values.postBody)
      if (values.mainImage) formData.append("mainImage", values.mainImage)
      if (values.picture1) formData.append("picture1", values.picture1)
      if (values.picture2) formData.append("picture2", values.picture2)

      const response = await axios.post(
        "", // url or?
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      console.log(response)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error")
    } finally {
      toast.success("Saved")
      actions.setSubmitting(false)
      // clear data to add more or go back?
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="flex w-full flex-col gap-16">
          <div className="flex justify-between">
            <H1>Add New Service</H1>
            <div className="flex gap-4">
              <button
                type="button"
                className="rounded-[5px] bg-[#2C303A] px-10 py-2 text-lg"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button type="submit" className="rounded-[5px] bg-violet px-10 py-2 text-lg" disabled={isSubmitting}>
                Submit
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col justify-between gap-8 sm:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col text-dark-300  dark:text-white">
                <InputLabel htmlFor="name" required>
                  Name
                </InputLabel>
                <Field
                  placeholder="Write the name of app"
                  name="name"
                  type="text"
                  className="h-9 rounded-[5px] border border-[#3F3F46] px-1 text-white dark:bg-dark-100  dark:text-dark-100"
                />
                <ErrorMessage name="name" component="div" className="text-[#FF4242]" />
              </div>
              <div className="flex flex-col  text-dark-100 dark:text-white">
                <InputLabel htmlFor="category" required>
                  Category
                </InputLabel>
                <Field
                  name="category"
                  as="select"
                  className="h-9 rounded-[5px] border border-[#3F3F46] text-dark-100 dark:bg-dark-100 dark:text-white"
                >
                  <option value="">Select a category</option>
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile Application">Mobile Application</option>
                  <option value="Product Design">Product Design</option>
                </Field>
                <ErrorMessage name="category" component="div" className="text-[#FF4242]" />
              </div>
              <div className="flex flex-col text-dark-300 dark:text-white">
                <InputLabel htmlFor="postBody" required>
                  Post Body
                </InputLabel>
                <Field
                  name="postBody"
                  as="textarea"
                  placeholder="Write the description"
                  className="h-[150px] resize-none rounded-[5px] border border-[#3F3F46] px-1 pt-1 text-dark-100 dark:bg-dark-100 dark:text-white"
                />
                <ErrorMessage name="postBody" component="div" className="text-[#FF4242]" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 text-black-100  dark:text-white">
              <div>
                <InputLabel htmlFor="mainImage" required>
                  Main Image
                </InputLabel>
                <ImageUploader name="mainImage" />
                <ErrorMessage name="mainImage" component="div" className="text-[#FF4242]" />
              </div>
              <div>
                <InputLabel htmlFor="picture1" required>
                  Picture 1
                </InputLabel>
                <ImageUploader name="picture1" />
                <ErrorMessage name="picture1" component="div" className="text-[#FF4242]" />
              </div>
              <div>
                <InputLabel htmlFor="picture2" required>
                  Picture 2
                </InputLabel>
                <ImageUploader name="picture2" />
                <ErrorMessage name="picture2" component="div" className="text-[#FF4242]" />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
