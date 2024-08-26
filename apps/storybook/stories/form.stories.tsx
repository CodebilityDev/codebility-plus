import type { Meta, StoryObj } from '@storybook/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from '@codevs/ui/form';

interface FormValues {
  username: string;
}

const meta = {
  title: 'ShadCN-Atomic/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      disabled: true,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      description: 'Form sizes',
      options: ['default', 'sm', 'lg'],
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const methods = useForm<FormValues>();
    const onSubmit: SubmitHandler<FormValues> = (data) => {
      console.log(data);
    };

    return (
      <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <form className={`form-${args.size}`} onSubmit={methods.handleSubmit(onSubmit)}>
          <FormField name="username" control={methods.control}>
            {({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <input type="text" {...field} />
                </FormControl>
                <FormDescription>This is your username.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <button type="submit">Submit</button>
        </form>
      </Form>
    );
  },
  args: {
    size: 'default',
  },
};
