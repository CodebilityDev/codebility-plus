"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import toast from "react-hot-toast";
import H1 from "@/Components/shared/dashboard/H1";
import { useRouter } from "next/navigation";
import { createServiceAction, updateServiceAction } from "../action";
import InputLabel from "./input-label";
import { Service, ServiceSelectedFile } from "../_types/service";
import { validationSchema } from "../_lib/schema";
import ServiceImageUpload from "./service-image-upload";
import { Category } from "../categories/_types/category";

const ServiceForm = ({ userId, service, categories }: { userId?: string | null, service?: Service, categories: Category[] }) => {
  const router = useRouter();

  const initialValues: Service = {
    name: service?.name || "",
    category: service?.category || "",
    description: service?.description || "",
    mainImage: service?.mainImage || null,
    picture1: service?.picture1 || null,
    picture2: service?.picture2 || null,
    images: service?.images || []
  };

  const [selectedFile, setSelectedFile] = useState<ServiceSelectedFile>({
    mainImageFile: service?.mainImage || null,
    picture1File: service?.picture1 || null,
    picture2File: service?.picture2 || null,
    images: service?.images || []
  });

  const mainImageFileInputRef = useRef<HTMLInputElement | null>(null);
  const picture1FileInputRef = useRef<HTMLInputElement | null>(null);
  const picture2FileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue(fieldName, file);
      setSelectedFile(prev => ({
        ...prev,
        [`${fieldName}File`]: file,
      }));
    } else {
      setSelectedFile(prev => ({
        ...prev,
        [`${fieldName}File`]: null,
      }));
    }
  };

  const handleDivClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleSubmit = async (
    values: Service,
    actions: FormikHelpers<Service>
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
        response = await updateServiceAction(formData);
      } else {
        response = await createServiceAction(formData);
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
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
                  ref={mainImageFileInputRef}
                  onChange={(event) => handleFileChange(event, setFieldValue, "mainImage")}
                  className="hidden"
                />
                {!selectedFile.mainImageFile ? 
                  <div 
                    onClick={() => handleDivClick(mainImageFileInputRef)}
                    className="flex h-24 flex-col items-center justify-center rounded-[5px] border border-[#3F3F46] bg-light-900 font-light text-black-100 dark:bg-dark-100  dark:text-white hover:cursor-pointer"
                  >
                      <p>Click to browse a file</p>
                  </div> 
                  : 
                  <div className="flex h-24 rounded-[5px] font-light text-black-100 dark:text-white">
                    <ServiceImageUpload selectedFile={selectedFile} imageType="mainImage" />
                    <div className="flex h-full w-10 items-center justify-center border border-[#3F3F46]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(prev => ({ ...prev, mainImageFile: null }));
                          setFieldValue("mainImage", null);
                        }}
                        className="text-[#FF4242] hover:cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                }
                <ErrorMessage name="mainImage" component="div" className="text-[#FF4242]" />
              </div>
              <div className="flex flex-col">
                <InputLabel htmlFor="picture1" required>Picture 1</InputLabel>
                <input
                  type="file"
                  name="picture1"
                  ref={picture1FileInputRef}
                  onChange={(event) => handleFileChange(event, setFieldValue, "picture1")}
                  className="hidden"
                />
                {!selectedFile.picture1File ? 
                  <div 
                    onClick={() => handleDivClick(picture1FileInputRef)}
                    className="flex h-24 flex-col items-center justify-center rounded-[5px] border border-[#3F3F46] bg-light-900 font-light text-black-100 dark:bg-dark-100 dark:text-white hover:cursor-pointer"
                  >
                      <p>Click to browse a file</p>
                  </div> 
                  : 
                  <div className="flex h-24 rounded-[5px] font-light text-black-100 dark:text-white">
                    <ServiceImageUpload selectedFile={selectedFile} imageType="picture1" />
                    <div className="flex h-full w-10 items-center justify-center border border-[#3F3F46]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(prev => ({ ...prev, picture1File: null }));
                          setFieldValue("picture1", null);
                        }}
                        className="text-[#FF4242] hover:cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                }
                <ErrorMessage name="picture1" component="div" className="text-[#FF4242]" />
              </div>
              <div className="flex flex-col">
                <InputLabel htmlFor="picture2" required>Picture 2</InputLabel>
                <input
                  type="file"
                  name="picture2"
                  ref={picture2FileInputRef}
                  onChange={(event) => handleFileChange(event, setFieldValue, "picture2")}
                  className="hidden"
                />
                {!selectedFile.picture2File ? 
                  <div 
                    onClick={() => handleDivClick(picture2FileInputRef)}
                    className="flex h-24 flex-col items-center justify-center rounded-[5px] border border-[#3F3F46] bg-light-900 font-light text-black-100 dark:bg-dark-100 dark:text-white hover:cursor-pointer"
                  >
                      <p>Click to browse a file</p>
                  </div> 
                  : 
                  <div className="flex h-24 rounded-[5px] font-light text-black-100 dark:text-white">
                    <ServiceImageUpload selectedFile={selectedFile} imageType="picture2" />
                    <div className="flex h-full w-10 items-center justify-center border border-[#3F3F46]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(prev => ({ ...prev, picture2File: null }));
                          setFieldValue("picture2", null);
                        }}
                        className="text-[#FF4242] hover:cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                }
                <ErrorMessage name="picture2" component="div" className="text-[#FF4242]" />
              </div>
            </div>
          </div>
          <div className="lg:hidden flex gap-4">
            <button 
              type="button" 
              className="rounded-[5px] w-full bg-white border dark:bg-[#2C303A] px-10 py-2 text-lg text-black dark:text-white"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rounded-[5px] w-full bg-violet px-10 py-2 text-lg text-white"
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