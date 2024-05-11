import logo from "@assets/img/logo.png";

export const Logo = () => {
  const url = "https://www.example.com";

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={url}
      className="flex items-center text-lg sm:text-3xl"
    >
      <img src={logo} alt="ByteSense Logo" className="mr-[0.5em] w-[1.4em]" />
      <h5 className="font-medium text-black dark:text-white">ByteSense</h5>
    </a>
  );
};
