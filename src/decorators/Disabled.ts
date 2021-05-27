export default function Disabled () {
  return (target: Function) => {
    target.prototype.disabled = true
  }
}