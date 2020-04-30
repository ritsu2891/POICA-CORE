expect.extend({
  toBeUUID(received) {
    const uuidPattern = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/;
    const pass = uuidPattern.test(received);
    if (pass) {
      return {
        message: () => 
          `expected ${received} not to be UUID.`,
        pass: true
      };
    } else {
      return {
        message: () => 
          `expected ${received} to be UUID.`,
        pass: false,
      };
    }
  }
});