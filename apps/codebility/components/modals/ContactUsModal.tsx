"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea-home";
import { useModal } from "@/hooks/use-modal";
import { contactUsValidation } from "@/lib/validations/contact-us";
import { IconClose } from "@/public/assets/svgs";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";

const ContactUsModal = () => {
  const { isOpen, onClose, type } = useModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    telephone: "",
    email: "",
    message: "",
  });
  const isModalOpen = isOpen && type === "contactUsModal";

  const handleReset = () => {
    setName("");
    setEmail("");
    setTelephone("");
    setMessage("");
    onClose();
  };

  const handleSubmit = async () => {
    const newMessage = { name, email, telephone, message };
    const validateFields = contactUsValidation.safeParse(newMessage);

    if (!validateFields.success) {
      const errors = validateFields.error.errors;

      const fieldErrors: { [key: string]: string } = {};
      errors.forEach((error) => {
        const fieldName = error.path[0] ?? "";
        fieldErrors[fieldName] = error.message;
      });
      setValidationErrors(fieldErrors as any);

      return;
    }

    try {
      // await axios.post(`${API.USERS}/contact-us`, newMessage);

      handleReset();
    } catch (error) {
      console.log("Contact Us Error: ", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleReset}>
      <DialogContent 
        className="bg-black-100 dark:bg-black-100 flex h-[40rem] w-full max-w-5xl flex-col items-center gap-6 overflow-x-auto overflow-y-auto md:w-[30rem] lg:h-[45rem] lg:w-full lg:flex-row"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
        role="dialog"
      >
        <DialogTitle id="contact-modal-title" className="sr-only">Contact Us</DialogTitle>
        <div className="w-full flex-1 flex-col gap-4">
          <Image
            className="mx-auto mb-2 hidden h-auto p-10 md:w-[250px] lg:flex lg:w-[300px]"
            src="/assets/svgs/icon-codebility.svg"
            alt="Codebility logo"
            priority
            width={30}
            height={40}
          />
          <div className="text-center">
            <h2 id="contact-modal-title" className="text-2xl text-white">
              Ready to take your next step?
            </h2>
            <p id="contact-modal-description" className="md:text-md text-gray text-sm lg:text-lg">
              Explore how Codebility can empower you.
            </p>
          </div>
        </div>

        <form className="bg-black-500 flex w-full flex-1 flex-col gap-3 rounded-lg p-6 lg:gap-6" role="form">
          <h3 className="text-lightgray mb-2 text-center text-lg">
            Contact Information
          </h3>

          <div>
            <Input
              id="name"
              type="text"
              label="Name"
              placeholder="What is your name?"
              value={name}
              required
              error={validationErrors.name}
              aria-invalid={!!validationErrors.name}
              onChange={(e) => {
                setName(e.target.value.toLowerCase());
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  name: "",
                }));
              }}
            />
          </div>

          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="What is your email?"
              value={email}
              required
              error={validationErrors.email}
              aria-invalid={!!validationErrors.email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  email: "",
                }));
              }}
            />
          </div>

          <div>
            <Input
              id="phone"
              type="tel"
              label="Telephone"
              placeholder="What is your telephone?"
              value={telephone}
              required
              error={validationErrors.telephone}
              aria-invalid={!!validationErrors.telephone}
              onChange={(e) => {
                setTelephone(e.target.value);
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  telephone: "",
                }));
              }}
            />
          </div>

          <div>
            <Textarea
              id="message"
              label="Message"
              placeholder="How can we help you?"
              value={message}
              required
              error={validationErrors.message}
              aria-invalid={!!validationErrors.message}
              onChange={(e) => {
                setMessage(e.target.value.toLowerCase());
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  message: "",
                }));
              }}
            />
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <Button 
              onClick={handleSubmit} 
              className="w-full lg:w-[130px]"
              aria-label="Submit contact form"
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
        <div>
          <button 
            onClick={() => onClose()} 
            className="absolute right-4 top-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-customBlue-500"
            aria-label="Close contact form dialog"
          >
            <IconClose aria-hidden="true" />
            <span className="sr-only">Close dialog</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUsModal;
