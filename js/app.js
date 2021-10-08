document.querySelector(".df-nav-theme").addEventListener("click", () => {
  document.body.toggleAttribute("dark");
});

const lorem =
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex sint ducimus ab earum quas maiores vel. Inventore quidem eaque facere nihil asperiores pariatur recusandae beatae quaerat nulla, eos numquam molestiae!";

const formatToDate = (x) => {
  const newDate = new Date(x).toString();
  const dateSlices = newDate.split(" ");
  return `${dateSlices[2]} ${dateSlices[1]} ${dateSlices[3]}`;
};

const getUser = async (x) => {
  try {
    const {
      bio,
      login,
      avatar_url,
      blog,
      company,
      created_at,
      followers,
      following,
      location,
      name,
      public_repos,
      twitter_username,
    } = await fetch(`https://api.github.com/users/${x}`).then((x) => {
      if (x.status >= 200 && x.status <= 299) {
        return x.json();
      } else {
        throw "Bad request";
      }
    });

    document.querySelector("[data-inject=username]").textContent = `@${
      login || "Not Available"
    }`;
    document.querySelector("[data-inject=name]").textContent =
      name || "Not Available";
    document.querySelector("[data-inject=date]").textContent = created_at
      ? `Joined ${formatToDate(created_at)}`
      : "Not Available";
    document.querySelector("[data-inject=description]").textContent =
      bio || lorem;
    document.querySelector("[data-inject=repos]").textContent =
      public_repos || 0;
    document.querySelector("[data-inject=followers]").textContent =
      followers || 0;
    document.querySelector("[data-inject=following]").textContent =
      following || 0;

    const groupInject = [
      {
        name: "location",
        value: location,
        action: (el) => {
          el.textContent = location || "Not Available";
        },
      },
      {
        name: "twitter",
        value: twitter_username,
        action: (el) => {
          el.textContent = twitter_username || "Not Available";
        },
      },
      {
        name: "blog",
        value: blog,
        action: (el) => {
          el.setAttribute("href", blog || "/");
          el.textContent = "https://github.blog" || "Not Available";
        },
      },
      {
        name: "company",
        value: company,
        action: (el) => {
          el.textContent = company || "Not Available";
        },
      },
    ];

    groupInject.forEach((x) => {
      const el = document.querySelector(`[data-inject=${x.name}]`);
      const parentNode = el.parentNode.parentNode;
      if (!x.value) {
        parentNode.setAttribute(
          "style",
          `filter: opacity(0.3); pointer-events: none; user-select: none;`
        );
      } else {
        parentNode.removeAttribute("style");
      }
      x.action(el);
    });
    document
      .querySelectorAll("[data-inject=image]")
      .forEach((x) =>
        x.setAttribute("src", avatar_url || "./assets/ironcat.jpg")
      );
  } catch (e) {
    document
      .querySelector(".df-search-wrapper")
      .classList.add("df-search-wrapper-error");
  }
};

getUser("octocat");

document.querySelector(".df-search-button").addEventListener("click", () => {
  document
    .querySelector(".df-search-wrapper")
    .classList.remove("df-search-wrapper-error");
  const { value } = document.querySelector(".df-search");
  getUser(value || "octocat");
});

document.querySelector(".df-search").addEventListener("input", () => {
  const wrapper = document.querySelector(".df-search-wrapper");
  if (wrapper.classList.contains("df-search-wrapper-error"))
    wrapper.classList.remove("df-search-wrapper-error");
});
