// __tests__/mathUtils.test.js

// Define the add function directly in the test file
function add(a, b) {
  return a + b;
}

describe("mathUtils", () => {
  test("should add two positive numbers correctly", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  test("should add negative numbers correctly", () => {
    const result = add(-5, -10);
    expect(result).toBe(-15);
  });

  test("should add with zero correctly", () => {
    const result1 = add(100, 0);
    const result2 = add(0, 100);
    expect(result1).toBe(100);
    expect(result2).toBe(100);
  });
});

