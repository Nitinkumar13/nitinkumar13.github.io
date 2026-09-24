export const formatINR = (amount) => {
  const value = Math.round(Number(amount) || 0);
  return "₹" + value.toLocaleString("en-IN");
};

export const formatAllocation = (amount, ratio) =>
  `₹${(amount * ratio).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
