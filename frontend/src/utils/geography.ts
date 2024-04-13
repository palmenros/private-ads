function deg2rad(degrees){
  let pi = Math.PI;
  return degrees * (pi/180);
}

export const latitudeLongitudeToCartesian = (latitudeDegrees, longitudeDegrees) => {  
    let lat = deg2rad(latitudeDegrees);
    let lon = deg2rad(longitudeDegrees)
    
    const R = 100

    let x = R * Math.cos(lat) * Math.cos(lon)
    let y = R * Math.cos(lat) * Math.sin(lon)    
    let z = R * Math.sin(lat)

    let xRound = Math.round(x)
    let yRound = Math.round(y)
    let zRound = Math.round(z)

    return [xRound, yRound, zRound]
}