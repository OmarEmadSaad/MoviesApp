import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { toast } from "react-toastify";
import {
  CardBody,
  CardFooter,
  Input,
  Button,
  Textarea,
} from "@material-tailwind/react";

const Contact = () => {
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_g9r5iz5",
        "template_ob26pqe",
        form.current,
        "IGCLiTemdvjUEWCk4"
      )
      .then(
        (result) => {
          toast.success("Message sent successfully✅");
          form.current.reset();
        },
        (error) => {
          toast.error("Something went wrong. Please try again❌");
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-12 gap-4">
      <h1 className="text-light-blue-800 text-3xl text-center sm:text-left">
        Contact with the Website developer!
      </h1>
      <form
        ref={form}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 font-semibold bg-black rounded-[1em] w-80 text-white">
        <CardBody className="flex flex-col gap-4">
          <Input
            name="user_email"
            label="Email Address"
            size="lg"
            className="text-white"
            labelProps={{ className: "text-white !text-white" }}
          />
          <Input
            name="subject"
            label="Subject"
            size="lg"
            className="text-white"
            labelProps={{ className: "text-white !text-white" }}
          />
          <Textarea
            name="message"
            label="Your Message"
            rows={6}
            className="text-white"
            labelProps={{ className: "text-white !text-white" }}
          />
        </CardBody>
        <CardFooter className="pt-4">
          <Button
            type="submit"
            variant="outlined"
            color="blue"
            fullWidth
            className="border-2 transition whitespace-nowrap px-2 py-2 min-w-[80px]">
            Send Message
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default Contact;
