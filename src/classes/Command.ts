export default class Command {
	/**
	 * This is the command key to process its command
	 */
	private key: string;

	/**
	 * This is the description of the command to process.
	 */
	private description: string;

	/**
	 * This is the action to process when the key is pressed.
	 */
	private action: CallableFunction;

	/**
	 * This is the default constructor for the command object.
	 *
	 * @param key
	 *     This is the key to process its command.
	 *
	 * @param description
	 *     This is a description of the command.
	 *
	 * @param action
	 *     This is the action to process when the key is pressed.
	 */
	constructor(key: string, description: string, action: CallableFunction) {
		this.key = key;
		this.description = description;
		this.action = action;
	}

  /**
   * This method is a getter for the command description.
   *
   * @returns
   *     The description of the command.
   */
  getDescription() {
    return this.description;
  }
  
	/**
	 * This function calls the action that needs to be done when
	 * the command key is pressed.
	 */
	public execute() {
		this.action();
	}
};
