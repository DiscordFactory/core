import Factory from './Factory'

export default class Application {
  public static getContainer () {
    return Factory.getInstance().$container
  }

  /**
   * Returns the instance
   * of the Discord Client linked to the bot.
   */
  public static getClient () {
    return Application.getContainer()?.client
  }

  /**
   * Returns the set of commands registered
   * within the application instance
   */
  public static getCommands () {
    return Application.getContainer()?.commands
  }

  /**
   * Returns the set of events registered
   * within the application instance
   */
  public static getEvents () {
    return Application.getContainer()?.events
  }

  /**
   * Returns the set of hooks registered
   * within the application instance
   */
  public static getHooks () {
    return Application.getContainer()?.hooks
  }

  /**
   * Returns the set of middlewares registered
   * within the application instance
   */
  public static getMiddlewares () {
    return Application.getContainer()?.middlewares
  }

  /**
   * Returns the set of providers registered
   * within the application instance
   */
  public static getProviders () {
    return Application.getContainer()?.providers
  }
}