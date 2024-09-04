import * as Yup from "yup";

export const validationSchema = Yup.object({
    name: Yup.string().required("Name is Required"),
    category: Yup.string().required("Category is Required"),
    description: Yup.string().required("Description is Required"),
    mainImage: Yup.mixed().required("Main Image is Required"),
    picture1: Yup.mixed().required("Picture 1 is Required"),
    picture2: Yup.mixed().required("Picture 2 is Required"),
});