const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
export const posts = [
  {
    href: "/blog/article",
    img: "/images/car-finder/blog/04.jpg",
    category: {
      href: "#",
      title: "Automotive News",
    },
    title: "Volkswagen: Never Done Innovating",
    slug: slugify("Volkswagen: Never Done Innovating"),
    content:
      '<p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><h3 class="text-light">Subtitle</h3><img class="mb-4" src="https://images.unsplash.com/photo-1718002125249-064336b5687b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p>',
    author: {
      href: "",
      img: "",
      name: "kaypush",
    },
    date: "Apr 15 2024",
    comments: "No comments",
  },
  {
    href: "/blog/article",
    img: "/images/car-finder/blog/05.jpg",
    category: {
      href: "#",
      title: "Tips & Advice",
    },
    title: "5 Predictions From the Past About the Future",
    slug: slugify("5 Predictions From the Past About the Future"),
    content:
      '<p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><h3 class="text-light">Subtitle</h3><img class="mb-4" src="https://images.unsplash.com/photo-1718002125249-064336b5687b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p>',
    author: {
      href: "",
      img: "",
      name: "kaypush",
    },
    date: "Apr 06 2024",
    comments: "2 comments",
  },
  {
    href: "/blog/article",
    img: "/images/car-finder/blog/06.jpg",
    category: {
      href: "#",
      title: "Reviews",
    },
    title: "This Year is All About New Harley Davidson",
    slug: slugify("This Year is All About New Harley Davidson"),
    content:
      '<p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><h3 class="text-light">Subtitle</h3><img class="mb-4" src="https://images.unsplash.com/photo-1718002125249-064336b5687b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p>',
    author: {
      href: "",
      img: "",
      name: "kaypush",
    },
    date: "Mar 25 2024",
    comments: "3 comments",
  },
  {
    href: "/blog/article",
    img: "/images/car-finder/blog/07.jpg",
    category: {
      href: "#",
      title: "Reviews",
    },
    title: "First ATV from KTM. Test Drive in Sahara",
    slug: slugify("First ATV from KTM. Test Drive in Sahara"),
    content:
      '<p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><h3 class="text-light">Subtitle</h3><img class="mb-4" src="https://images.unsplash.com/photo-1718002125249-064336b5687b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p>',
    author: {
      href: "",
      img: "",
      name: "kaypush",
    },
    date: "Mar 12 2024",
    comments: "8 comments",
  },
  {
    href: "/blog/article",
    img: "/images/car-finder/blog/08.jpg",
    category: {
      href: "#",
      title: "Automotive News",
    },
    title: "Closer Look at Yet Another Electric Bike Startup",
    slug: slugify("Closer Look at Yet Another Electric Bike Startup"),
    content:
      '<p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><h3 class="text-light">Subtitle</h3><img class="mb-4" src="https://images.unsplash.com/photo-1718002125249-064336b5687b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p>',
    author: {
      href: "",
      img: "",
      name: "kaypush",
    },
    date: "Feb 28 2024",
    comments: "5 comments",
  },
  {
    href: "/blog/article",
    img: "/images/car-finder/blog/09.jpg",
    category: {
      href: "#",
      title: "Reviews",
    },
    title: "All New Aston Martin Superleggera",
    slug: slugify("All New Aston Martin Superleggera"),
    content:
      '<p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><h3 class="text-light">Subtitle</h3><img class="mb-4" src="https://images.unsplash.com/photo-1718002125249-064336b5687b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p><p class="text-light fs-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae auctor neque. In hac habitasse platea dictumst. Sed varius venenatis augue, vehicula congue lectus accumsan accumsan. Phasellus eget lobortis arcu, vitae lacinia nibh. Duis nec facilisis magna. Donec porttitor convallis iaculis. Phasellus quis ultrices neque. Donec hendrerit, magna auctor eleifend pulvinar, nisl tortor accumsan lectus, et cursus orci urna accumsan nisl.</p>',
    author: {
      href: "",
      img: "",
      name: "kaypush",
    },
    date: "Feb 19 2024",
    comments: "10 comments",
  },
]

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug)
}

export function getAllPostSlugs() {
  return posts.map((post) => {
    return {
      params: {
        postSlug: post.slug,
      },
    }
  })
}
