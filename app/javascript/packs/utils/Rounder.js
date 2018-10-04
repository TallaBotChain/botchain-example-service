const isFloat = (n) => {
    return n === +n && n !== (n|0);
}

export const round = (value) => {
  let float = value
  if (!isFloat(value)) {
    float = parseFloat(value)
  }
  switch (true) {
    case (float >= 1.0):
        return float.toFixed(2)
        break;
    case (float >= 0.001 && float < 1.0 ):
        return float.toFixed(3)
        break;
    case (float >= 0.000001 && float < 0.001 ):
        return float.toFixed(6)
        break;
    case (float >= 0.000000001 && float < 0.000001 ):
        return float.toFixed(9)
        break;
    default:
        return value
        break;
  }
}
