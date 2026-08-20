import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { Seo } from "@/lib/seo/Seo";
import { Container } from "@/components/ui/Container";

const SERVICE_ID = "service_g9r5iz5";
const TEMPLATE_ID = "template_ob26pqe";
const PUBLIC_KEY = "IGCLiTemdvjUEWCk4";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current || submitting) return;

    setSubmitting(true);
    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY,
      );
      toast.success("Message sent successfully");
      formRef.current.reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact us"
        description="Get in touch with the developer of React Movies with questions, bug reports or feedback about the site."
        canonicalPath="/contact-us"
      />

      <Container width="narrow" className="py-12">
        <h1 className="mb-2 text-center text-2xl font-bold text-light-blue-800 sm:text-3xl">
          Contact the developer
        </h1>
        <p className="mx-auto mb-8 max-w-prose text-center text-sm text-gray-400">
          Questions, bug reports or feedback about React Movies are all welcome.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-5 rounded-2xl bg-gray-900 p-6 text-white"
        >
          <Field
            id="user_email"
            name="user_email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
          />
          <Field id="subject" name="subject" label="Subject" required />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium">
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg border-2 border-blue-500 px-4 py-2 font-semibold text-blue-400 transition hover:bg-blue-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </Container>
    </>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
      />
    </div>
  );
}
