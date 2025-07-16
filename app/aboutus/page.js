export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center">About Easy Budget</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">What is Easy Budget?</h2>
        <p>
          Easy Budget is a simple and intuitive app that helps you track your
          income, expenses, and overall financial health. Designed for ease of
          use, it’s perfect for anyone looking to manage their money more
          effectively.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Support & Feedback</h2>
        <p>
          Have a question, suggestion, or need help? Feel free to contact us:
        </p>
        <ul className="list-disc ml-5 mt-2">
          <li>
            Email:{" "}
            <a
              href="mailto:support@easybudget.app"
              className="text-blue-500 underline"
            >
              support@easybudget.app
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Our Team</h2>
        <p>
          We are a small team passionate about personal finance and helping
          people gain better control of their money through smart, minimalist
          tools.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="mb-4">
          <h3 className="font-bold">Is Easy Budget free to use?</h3>
          <p>Yes! Easy Budget is completely free for personal use.</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">Will my data be private?</h3>
          <p>
            Absolutely. Your financial data is stored securely and is never
            shared with third parties.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">Can I use Easy Budget on mobile?</h3>
          <p>
            Yes, Easy Budget is mobile-friendly and works smoothly on
            smartphones and tablets.
          </p>
        </div>
      </section>

      <footer className="text-sm text-center mt-10 text-gray-500 dark:text-gray-400">
        © 2025 Easy Budget. All rights reserved.
      </footer>
    </div>
  );
}
