export const headerTransformer =  {
  to: (val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
};
