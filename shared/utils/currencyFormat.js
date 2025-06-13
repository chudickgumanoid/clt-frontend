export const currencyFormat = (amount, { decimals = "auto" } = {}) => {
  amount = Number(amount);

  let min = 0;
  let max = 0;

  if (decimals === "auto") {
    min = amount % 1 === 0 ? 0 : 2;
    max = 2;
  } else if (typeof decimals === "number") {
    min = max = decimals;
  }

  return Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  })
    .format(amount)
    .replace(",", ".");
};

export const tengeFormat = (value) => currencyFormat(value) + " тг";
