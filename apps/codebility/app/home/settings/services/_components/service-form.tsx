"use client"

import { ChangeEvent } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import toast from "react-hot-toast";
import H1 from "@/Components/shared/dashboard/H1";
import { useRouter } from "next/navigation";
import { createServices, updateService } from "../action";
import * as Yup from "yup";
import { service_FormValuesT } from "@/types/protectedroutes";
import InputLabel from "./input-label";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is Required"),
  category: Yup.string().required("Category is Required"),
  description: Yup.string().required("Description is Required"),
  mainImage: Yup.mixed().required("Main Image is Required"),
  picture1: Yup.mixed().required("Picture 1 is Required"),
  picture2: Yup.mixed().required("Picture 2 is Required"),
});

const ServiceForm = ({ userId, service }: { userId?: string | null, service?: service_FormValuesT }) => {
  const router = useRouter();

  const initialValues: service_FormValuesT = {
    name: service?.name || "",
    category: service?.category || "",
    description: service?.description || "",
    mainImage: service?.mainImage || null,
    picture1: service?.picture1 || null,
    picture2: service?.picture2 || null,
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void, fieldName: string) => {
    const file = event.target.files?.[0];
    setFieldValue(fieldName, file);
  };

  const handleSubmit = async (
    values: service_FormValuesT,
    actions: FormikHelpers<service_FormValuesT>
  ) => {
    if (!userId) return;

    try { 
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("description", values.description);
      if (values.mainImage) formData.append("mainImage", values.mainImage as File);
      if (values.picture1) formData.append("picture1", values.picture1 as File);
      if (values.picture2) formData.append("picture2", values.picture2 as File);
      formData.append("userId", userId);

      let response;

      if (service?.id) {
        formData.append("id", service.id);
        response = await updateService(formData);
      } else {
        response = await createServices(formData);
      }

      if (response?.success) {
        toast.success(service?.id ? "Service Updated Successfully" : "Service Created Successfully");
        router.back();
      } else {
        console.error("Failed to save service:", response?.error);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, setFieldValue }) => (
        <Form className="max-w-screen-xl mx-auto flex w-full flex-col gap-16">
          <div className="flex justify-between">
            <H1>{service?.id ? "Update Service" : "Add New Service"}</H1>
            <div className="hidden lg:flex gap-4">
              <button
                type="button"
                className="rounded-[5px] bg-white border dark:bg-[#2C303A] px-10 py-2 text-lg text-black dark:text-white"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="rounded-[5px] bg-violet px-10 py-2 text-lg text-white" 
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col justify-between gap-8 sm:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col text-dark-300 dark:text-white">
                <InputLabel htmlFor="name" required>
                  Name
                </InputLabel>
                <Field
                  placeholder="Write the name of the app"
                  name="name"
                  type="text"
                  className="h-9 rounded-[5px] border border-[#3F3F46] px-1 text-dark-100 dark:bg-dark-100 dark:text-white"
                />
                <ErrorMessage name="name" component="div" className="text-[#FF4242]" />
              </div>
              <div className="flex flex-col text-dark-100 dark:text-white">
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
                <InputLabel htmlFor="description" required>
                  Description
                </InputLabel>
                <Field
                  name="description"
                  as="textarea"
                  placeholder="Write the description"
                  className="h-[150px] resize-none rounded-[5px] border border-[#3F3F46] px-1 pt-1 text-dark-100 dark:bg-dark-100 dark:text-white"
                />
                <ErrorMessage name="description" component="div" className="text-[#FF4242]" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 text-black-100 dark:text-white">
              <div className="flex flex-col">
                <InputLabel htmlFor="mainImage" required>Main Image</InputLabel>
                <input
                  type="file"
                  name="mainImage"
                  onChange={(event) => handleFileChange(event, setFieldValue, "mainImage")}
                />
                <ErrorMessage name="mainImage" component="div" className="text-[#FF4242]" />
              </div>
              <div className="flex flex-col">
                <InputLabel htmlFor="picture1" required>Picture 1</InputLabel>
                <input
                  type="file"
                  name="picture1"
                  onChange={(event) => handleFileChange(event, setFieldValue, "picture1")}
                />
                <ErrorMessage name="picture1" component="div" className="text-[#FF4242]" />
              </div>
              <div className="flex flex-col">
                <InputLabel htmlFor="picture2" required>Picture 2</InputLabel>
                <input
                  type="file"
                  name="picture2"
                  onChange={(event) => handleFileChange(event, setFieldValue, "picture2")}
                />
                <ErrorMessage name="picture2" component="div" className="text-[#FF4242]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center lg:hidden">
            <button
              type="button"
              className="rounded-[5px] bg-white border dark:bg-[#2C303A] px-10 py-2 text-lg text-black dark:text-white"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rounded-[5px] bg-violet px-10 py-2 text-lg text-white" 
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ServiceForm;
