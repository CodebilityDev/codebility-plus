"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea-home";
import { useModal } from "@/hooks/use-modal";
import { contactUsValidation } from "@/lib/validations/contact-us";
import { IconClose } from "@/public/assets/svgs";

import { Dialog, DialogContent, DialogFooter } from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";
import React from "react";

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
      <DialogContent className="bg-black-100 dark:bg-black-100 flex h-[40rem] w-full max-w-5xl flex-col items-center gap-6 overflow-x-auto overflow-y-auto md:w-[30rem] lg:h-[45rem] lg:w-full lg:flex-row">
        <div className="w-full flex-1 flex-col gap-4">
          <Image
            className="mx-auto mb-2 hidden h-auto p-10 md:w-[250px] lg:flex lg:w-[300px]"
            src="/assets/svgs/icon-codebility.svg"
            alt="logo"
            priority
            width={30}
            height={40}
          />
          <div className="text-center">
            <p className="text-2xl text-white">Ready to take your next step?</p>
            <p className="md:text-md text-gray text-sm lg:text-lg">
              Explore how Codebility can empower you.
            </p>
          </div>
        </div>

        <div className="bg-black-500 flex w-full flex-1 flex-col gap-3 rounded-lg p-6 lg:gap-6">
          <p className="text-lightgray mb-2 text-center text-lg">
            Contact Information
          </p>

          <div>
            <Input
              id="name"
              type="text"
              label="Name"
              placeholder="What is your name?"
              value={name}
              onChange={(e) => {
                setName(e.target.value.toLowerCase());
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  name: "",
                }));
              }}
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <Input
              id="email"
              type="text"
              label="Email"
              placeholder="What is your email?"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  email: "",
                }));
              }}
            />
            {validationErrors.email && (
              <p className="text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <Input
              id="phone"
              type="number"
              label="Telephone"
              placeholder="What is your telephone?"
              value={telephone}
              onChange={(e) => {
                setTelephone(e.target.value);
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  telephone: "",
                }));
              }}
            />
            {validationErrors.telephone && (
              <p className="text-red-500">{validationErrors.telephone}</p>
            )}
          </div>

          <div>
            <Textarea
              id="message"
              label="Message"
              placeholder="How can we help you?"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value.toLowerCase());
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  message: "",
                }));
              }}
            />
            {validationErrors.message && (
              <p className="text-red-500">{validationErrors.message}</p>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <Button onClick={handleSubmit} className="w-full lg:w-[130px]">
              Submit
            </Button>
          </DialogFooter>
        </div>
        <div>
            <button onClick={() => onClose()} className="absolute right-4 top-4">
            <Image 
              src={IconClose} 
              alt="Close" 
              width={24} 
              height={24}
              priority
            />
            </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUsModal;
