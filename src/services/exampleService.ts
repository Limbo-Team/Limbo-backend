class ExampleService {
    constructor() {}

    public async getWelcomeMessage(): Promise<string> {
        return 'Welcome to the API';
    }
}

export default new ExampleService();
