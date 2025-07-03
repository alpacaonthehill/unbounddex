function urlFromNameAndForm(name: string, form: string) {
  return (
    name.replaceAll(" ", "-").replaceAll("Gigantamax", "gmax") +
    (form ? "-" + form.split("-")[0].split(" ")[0] : "")
  )
    .replaceAll("'", "")
    .replaceAll(".", "")
    .replaceAll(":", "")
    .replaceAll("%", "")
    .toLowerCase();
}

function spriteFromUrl(url: string) {
  if (url.startsWith("sinistea")) {
    return "sinistea";
  } else if (url.startsWith("polteageist")) {
    return "polteageist";
  } else if (url.startsWith("gmax-toxtricity")) {
    return "gmax-toxtricity";
  } else if (url === "gmax-appletun" || url === "gmax-flapple") {
    return "gmax-flappletun";
  } else {
    return url;
  }
}

function iconFromUrl(url: string) {
  if (url.startsWith("arceus")) {
    return "arceus-1";
  } else if (url.startsWith("silvally")) {
    return "silvally-1";
  } else if (url.startsWith("castform")) {
    return "castform-1";
  } else if (url.startsWith("sinistea")) {
    return "sinistea-1";
  } else if (url.startsWith("polteageist")) {
    return "polteageist-1";
  } else if (url.startsWith("gmax-toxtricity")) {
    return "gmax-toxtricity-1";
  } else if (url === "gmax-appletun" || url === "gmax-flapple") {
    return "gmax-flappletun-1";
  } else {
    return url + "-1";
  }
}

export { urlFromNameAndForm, spriteFromUrl, iconFromUrl };
