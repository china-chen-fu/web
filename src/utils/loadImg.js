export default function imgUrl(path) {
  return new URL(`../assets/images/${path}`, import.meta.url).href
}
