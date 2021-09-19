const http = require('http')
const fs = require('fs')
const yargs = require('yargs')
const url = require('url')
const Jimp = require('jimp')
/** 
1. El servidor debe ser levantado por instrucción de una aplicación Node que use el
paquete Yargs para capturar los argumentos en la línea de comando. Se deberá
ejecutar el comando para levantar el servidor solo si el valor de la propiedad “key” es
la correcta (123).
 */
const pass = 123
const argv = yargs
    .command(
        'acceso',
        'Comando para acceder al desafio Black and White',
        {
            pass: {
                describe: 'Contraseña',
                demand: true,
                alias: 'p',
            },
        },
        (args) => {
            // Paso 7
            args.pass == pass
                ?
                http
                    .createServer((req, res) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' })
                        /** 
                         * 2. El servidor debe disponibilizar una ruta raíz que devuelva un HTML con el formulario
                        para el ingreso de la URL de la imagen a tratar
                          */

                        if (req.url == '/') {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            fs.readFile('index.html', 'utf8', (err, html) => {
                                res.end(html)
                            })
                        }
                        /** 
                         * 3. Los estilos de este HTML deben ser definidos por un archivo CSS alojado en el
                    servidor.
                         */
                        if (req.url == '/estilos') {
                            res.writeHead(200, { 'Content-Type': 'text/css' })
                            fs.readFile('estilos.css', (err, css) => {
                                res.end(css)
                            })
                        }


                        /**
                    4. El formulario debe redirigir a otra ruta del servidor que deberá procesar la imagen
                    tomada por la URL enviada del formulario con el paquete Jimp. La imagen debe ser
                    procesada en escala de grises, con calidad a un 60% y redimensionada a unos 350px
                    de ancho. Posteriormente debe ser guardada con nombre “newImg.jpg” y devuelta al
                    cliente
                     */
                        if (req.url.includes('/fotografia')) {
                            const params = url.parse(req.url, true).query;
                            const nombre = params.nombre;
                            console.log(nombre);
                            Jimp.read(nombre, (err, imagen) => {
                                imagen
                                    .resize(Jimp.AUTO, 350)
                                    .greyscale()
                                    .quality(60)
                                    .writeAsync('newImg.jpg')
                                    .then(() => {
                                        fs.readFile('newImg.jpg', (err, Imagen) => {
                                            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
                                            res.end(Imagen)
                                        })
                                    })
                            })

                        }






                    })
                    .listen(3000, () => console.log('Servidor encendido puerto 3000'))
                :
                console.log('Credenciales incorrectas')
        }
    )
    .help().argv








