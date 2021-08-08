export default abstract class Manager {
  public abstract dispatch (): Promise<void>
}