// "use client";

// import { useState } from "react";
// import { userDeletionSchema } from "@/schema/account-settings-zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { DialogClose } from "@radix-ui/react-dialog";
// import { AlertCircle, Trash2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Alert, AlertDescription, AlertTitle } from "@codevs/ui/alert";
// import { Button } from "@codevs/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@codevs/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@codevs/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@codevs/ui/form";
// import { Input } from "@codevs/ui/input";

// import AccountSettingsBackdrop from "./account-settings-backdrop";

// export default function AccountSettingsDelete() {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const form = useForm<z.infer<typeof userDeletionSchema>>({
//     resolver: zodResolver(userDeletionSchema),
//     mode: "onChange",
//     defaultValues: {
//       confirmation: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof userDeletionSchema>) => {
//     console.log(values);
//     setIsOpen(false);
//     form.reset();
//   };
//   return (
//     <>
//       <AccountSettingsBackdrop isOpen={isOpen} />
//       <Card className="background-box text-dark100_light900 w-full border border-red-600">
//         <CardHeader>
//           <CardTitle className="flex items-center text-base text-red-600 sm:text-2xl">
//             <Trash2 className="mr-2" /> Delete Account
//           </CardTitle>
//           <CardDescription className="text-xs sm:text-sm">
//             Permanently delete your account and all associated data.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Alert className="background-box mb-4 border border-red-600 text-red-600">
//             <AlertCircle className="h-4 w-4" color="red" />
//             <AlertTitle>Warning</AlertTitle>
//             <AlertDescription className="text-xs sm:text-sm">
//               This action is irreversible. All your data will be permanently
//               deleted.
//             </AlertDescription>
//           </Alert>
//           <Form {...form}>
//             <Dialog
//               open={isOpen}
//               onOpenChange={(open) => {
//                 setIsOpen(open);
//                 if (!open) {
//                   form.reset();
//                 }
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button variant="destructive">Delete Account</Button>
//               </DialogTrigger>
//               <DialogContent className="text-dark100_light900 background-box w-[90%] sm:w-full">
//                 <DialogHeader>
//                   <DialogTitle>Are you absolutely sure?</DialogTitle>
//                   <DialogDescription>
//                     This action cannot be undone. This will permanently delete
//                     your account and remove your data from our servers.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
//                   <FormField
//                     control={form.control}
//                     name="confirmation"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <Input
//                             placeholder="Type DELETE to confirm"
//                             labelClassName="sm:text-base text-sm"
//                             label=" To confirm, type DELETE in the box below:"
//                             parentClassName="flex flex-col gap-2"
//                             variant={"lightgray"}
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage className="text-red-600" />
//                       </FormItem>
//                     )}
//                   />
//                   <DialogFooter className="mt-4 gap-2">
//                     <DialogClose asChild>
//                       <Button variant="outline">Cancel</Button>
//                     </DialogClose>
//                     <Button
//                       variant="destructive"
//                       type="submit"
//                       disabled={!form.formState.isValid}
//                     >
//                       Delete Account
//                     </Button>
//                   </DialogFooter>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </Form>
//         </CardContent>
//       </Card>
//     </>
//   );
// }
