import { setLabelAndFaIcon } from "./fontAwesomeUtilities.js";

const defaultData = {
  name: "F. Rosset",
  githubName: "frarosset",
};

export default function setCreditFooter(data) {
  data = Object.assign(defaultData, data);

  let footer = document.querySelector("footer");

  if (!footer) {
    footer = document.createElement("footer");
    document.body.appendChild(footer);
  }

  const a = document.createElement("a");
  a.href = `https://github.com/${data.githubName}`;
  setLabelAndFaIcon(
    a,
    { prefix: "brands", icon: "github" },
    `${data.name} `,
    false
  );

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("Created by "));
  p.appendChild(a);

  const divContainer = document.createElement("div");
  divContainer.classList.add = "credit-footer";
  divContainer.appendChild(p);

  // Apply styling

  // Fonts loading: see https://stackoverflow.com/questions/5586845/how-to-import-font-file-using-javascript
  const addFont = (name, url) => {
    const font_name = new FontFace(name, `url('${url}')`);
    document.fonts.add(font_name);
  };
  const aFont = "Bad Script";
  const pFont = "Montserrat";
  const fonts = {};
  fonts["Montserrat"] =
    `https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2`;
  fonts["Bad Script"] =
    "https://fonts.gstatic.com/s/badscript/v16/6NUT8F6PJgbFWQn47_x7pOskzA.woff2";
  for (const font in fonts) {
    addFont(font, fonts[font]);
  }

  const color = "rgb(0, 0, 0)";
  const bgColor = "rgb(210, 210, 210, 50%)";
  const fontSize = "16px";
  const iconSize = "21px";
  const padding = "5px";
  const lineHeight = "1.5";

  a.style.color = color;
  a.style.fontFamily = `"${aFont}", monospace`;
  p.style.fontSize = fontSize;
  a.style.fontWeight = "800";
  a.style.lineHeight = "inherit";
  a.style.textDecoration = "none";
  a.style.verticalAlign = "middle";

  a.children[0].style.fontSize = iconSize; // set FaIcon size
  a.children[0].style.lineHeight = "inherit";
  a.children[0].style.verticalAlign = "top";

  p.style.color = color;
  p.style.fontFamily = `"${pFont}", sans-serif`;
  p.style.fontSize = fontSize;
  p.style.lineHeight = lineHeight;
  p.style.textAlign = "center";
  p.style.verticalAlign = "middle";
  p.style.width = "100%";

  divContainer.style.alignItems = "center";
  divContainer.style.backgroundColor = bgColor;
  divContainer.style.display = "flex";
  divContainer.style.justifyContent = "center";
  divContainer.style.padding = padding;
  divContainer.style.width = "100%";

  // Add to DOM
  footer.appendChild(divContainer);

  return divContainer;
}
