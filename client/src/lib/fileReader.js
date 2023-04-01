// // let reader = new FileReader()

// // const readFile = (file) => {
// //   return new Promise((res, rej) => {
// //     res(reader.readAsDataURL(file));
// //   });
// // }

// // reader.addEventListener('load', () => {return reader.result})

// // const getImagePath = async (file) => {
// //   let result = await readFile(file);
// //   console.log(result);
// //   return console.log('working');
// // };

// const getImagePath = (file) => {
//   let reader = new FileReader();
//   reader.addEventListener(
//     'load',
//     () => {return reader.result},
//     false
//   );

//   if (file) {
//     reader.readAsDataURL(file);
//   }
// };

const getImagePath = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => resolve(reader.result))
      reader.readAsDataURL(file);
    })
}


export default getImagePath