const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();
const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

//Verificación de Autenticación Por Token
const getToken = (user) => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30 days' }); //almacenando token desde el user id y la libreria jsonwebtoken

//Creación de Metodo getUserFromToken para las mutaciones que lo requieren
const getUserFromToken = async (token, db) => {
    if (!token) { return null }
    const tokenData = jwt.verify(token, JWT_SECRET); //funcion de la libreria jsonwebtoken
    if (!tokenData?.id) {
     return null;
    }
                //busca el usuario con el _id igual al que reresa el ObjectId
    return await db.collection('usuarios').findOne({ _id: ObjectId(tokenData.id) });  
}

const resolvers = {
    
    Query: {
        myProyectos: async (_, __, { db, user}) => {  //Ver lista de tareas
           if (!user) { throw new Error('Error de Autenticación, por favor inicie Sesión'); }
           if (user.rol === "Lider") {
            return await db.collection('proyectos')   //busqueda
                .find({ userIds: user._id })
                .toArray();
           }
            if (user.rol === "Administrador" || "Estudiante") { 
            return await db.collection('proyectos')   //busqueda
            .find()
            .toArray();
            }
        },
        myInscripciones: async (_, __, { db, user}) => {  //Ver lista de tareas
            if (!user) { throw new Error('Error de Autenticación, por favor inicie Sesión'); }
            
             return await db.collection('inscripciones')   //busqueda
                 .find()
                 .toArray();
                        
         },
        myAvances: async (_, __, { db, user}) => {  //Ver lista de tareas
            if (!user) { throw new Error('Error de Autenticación, por favor inicie Sesión'); }
            
             return await db.collection('avances')   //busqueda
                 .find()
                 .toArray();
                        
         },
        getProyecto: async (_, { id }, { db, user }) => {  //Ver tareas por ID
            if (!user) { throw new Error('Error de Autenticación, por favor inicie Sesión'); }
            return await db.collection('proyectos').findOne({ _id: ObjectId(id) });
        },
        getInscripcion: async (_, { id }, { db, user }) => {  //Ver tareas por ID
            if (!user) { throw new Error('Error de Autenticación, por favor inicie Sesión'); }
            return await db.collection('inscripciones').findOne({ _id: ObjectId(id) });
        },
        getAvance: async (_, { id }, { db, user }) => {  //Ver tareas por ID
            if (!user) { throw new Error('Error de Autenticación, por favor inicie Sesión'); }
            return await db.collection('avances').findOne({ _id: ObjectId(id) });
        }
    },

    
    //Mutationes
    Mutation: {
        signUp: async (root, { input }, { db }) => {   //Registrarse
            const hashedPassword = bcrypt.hashSync(input.password) //hasheamos la contraseña que viene desde el input
            const newUser = { //Creamos al nuevo usuario
                ...input,
                estado:"Pendiente",
                password: hashedPassword,
            }
            const result = await db.collection("usuarios").insertOne(newUser);  //Funcion asincrona que puede recibir 3 argumentos y regresa un objeto
            return {  //el esquema pide que se regrese un usuario cuando el proceso se haga bien, al igual que un token
                user: newUser,
                //token: getToken(newUser),
            }
        },

        signIn: async (root, { input }, { db }) => {    //Iniciar Sesión
            const user = await db.collection('usuarios').findOne({ mail: input.mail }); //compara el email en el input con los que estan en la collecion user
            const isPasswordCorrect = user && bcrypt.compareSync(input.password, user.password); //compara el hash del password en el input con los que estan en la collecion user
            if (!user || !isPasswordCorrect) {  //Verificamos si ambas respuestas son true
                throw new Error('Credenciales erroneas :('); //sino son true, lanzamos error
            }
            if (user.estado==="Pendiente")
            throw new Error('Usuario no autorizado :(');
            return {//si son true retornamos la información completa que hay del usuario en la collecion
                user,
                token: getToken(user), //asignamos un getToken al campo token
            }
        },

        updateUser: async (_, data, password, { db, user }) => {
            const hashedPassword = bcrypt.hashSync(data.password) 
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer

            const result = await db.collection("usuarios")
            //const hashedPassword = bcrypt.hashSync(data.password)
                .updateOne({
                    _id: ObjectId(data.id)
                   
                },
                {
                    $set: data,
                    $set:password
                },{
                    password: hashedPassword
                })
                
            return await db.collection("usuarios").findOne({ _id: ObjectId(data.id) });
        },

        createProyecto: async (root, { nombreProyecto, objetivoGen, objetivoEsp,
            presupuesto, fechaFin, estado, fase }, { db, user }) => {    //Registrar un proyecto
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") } //Solo usuarios correctamente logueados lo pueden hacer
            const newProyecto = {  //Creamos un nuevo proyecto
                nombreProyecto,
                objetivoGen,
                objetivoEsp,
                presupuesto,
                fechaFin,
                estado: "Inactivo",
                fase: "Null",
                fechaInicio: new Date().toISOString(),
                userIds: [user._id], //Crea un arreglo donde se guardaran los ID de los usuarios relacionados
                userNames: [user.nombre],
                userIdentificacion: [user.identificacion] //Crea un arreglo donde se guardaran los Nombres de los usuarios relacionados
            }
            console.log("Proyecto creado Correctamente") //mensaje de consola
            const result = await db.collection("proyectos").insertOne(newProyecto); //guardar el documento en la coleccion corespondiente
            return newProyecto 
        },

        updateProyecto: async (_, data, { db, user }) => {
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer

            const result = await db.collection("proyectos")
                .updateOne({
                    _id: ObjectId(data.id)
                }, {
                    $set: data
                })
            return await db.collection("proyectos").findOne({ _id: ObjectId(data.id) });
        },

        deleteProyecto: async (_, { id }, { db, user }) => {   //Eliminar un proyecto, mutacion pide el id de la tarea a eliminar
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer

            await db.collection("proyectos").remove({ _id: ObjectId(id) }); //Se elimina la tarea que tiene el id ingresado en el imput
            console.log("Tarea Eliminada Correctamente")
            return true; //regresa booleano
        },


        addUserToProyecto: async (_, { proyectoId, userId }, { db, user }) => {
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer
            const proyecto = await db.collection("proyectos").findOne({ _id: ObjectId(proyectoId) });
            const usuario = await db.collection("usuarios").findOne({ _id: ObjectId(userId) });

            if (!proyecto) {
                return null; //Cambiar respuesta a su gusto
            }

            if (proyecto.userIds.find((dbId) => dbId.toString() === userId.toString())) {
                return proyecto;  //Evitamos duplicidad verificando la existencia previa del usuario
            }
            await db.collection("proyectos")
                .updateOne({  //busca proyecto a actualizar
                    _id: ObjectId(proyectoId)
                }, {
                    $push: {
                        userIds: ObjectId(userId),  //empuja el objectid(userId) al arreglo userIds
                        userNames: usuario.nombre,  //empuja el nombre del usuario al arreglo usernames
                    }
                })
            proyecto.userIds.push(ObjectId(userId))  //Confirmación
            proyecto.userNames.push(usuario.nombre)  //confirmación
            return proyecto;
        },

        //Inscripcion a proyectos
        createInscripcion: async (root, {proyectoId}, { db, user }) => {
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer
            const newInscripcion = {
                
                //userIds: ObjectId(userId),
                estadoInscripcion: "pendiente",
                fechaInscripcion: new Date().toISOString(),
                fechaEgreso: "Null",
                proyectoId: ObjectId(proyectoId),
                //userIds: [user._id], //Crea un arreglo donde se guardaran los ID de los usuarios relacionados
                //userNames: [user.nombre],
                //proyectoIds: [proyectos._id],
                //proyectoNames: [proyectos.nombreProyecto]
            }
           // if (proyecto.userIds.find((dbId) => dbId.toString() === userId.toString())) {
            //    return proyecto;  //Evitamos duplicidad verificando la existencia previa del usuario
            //}
            const result = await db.collection("inscripciones").insertOne(newInscripcion);
            return newInscripcion;
        },
        updateInscripcion: async (_, data, { db, user }) => {
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer

            const result = await db.collection("inscripciones")
                .updateOne({
                    _id: ObjectId(data.id)
                }, {
                    $set: data,
                    //createdAt: new Date().toISOString()
                })
            return await db.collection("inscripciones").findOne({ _id: ObjectId(data.id) });
        },

        //Avances
        createAvance: async (root, { descripAvance, observacion, inscripcionId }, { db, user }) => {
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer
            const newAvance = {
                descripAvance,
                observacion,
                fechaAvance: new Date().toISOString(),
                inscripcionId: ObjectId(inscripcionId),
            }
            const result = await db.collection("avances").insertOne(newAvance);
            return newAvance;
        },

        updateAvance: async (_, data, { db, user }) => {
            if (!user) { console.log("No esta autenticado, por favor inicie sesión.") }  //Solo usuarios correctamente logueados lo pueden hacer

            const result = await db.collection("avances")
                .updateOne({
                    _id: ObjectId(data.id)
                }, {
                    $set: data
                })
            return await db.collection("avances").findOne({ _id: ObjectId(data.id) });
        },



    },

    //Parametros inmutables del user
    user: {
        id: (root) => {
            return root._id;
        }
    },

    //Parametros inmutables de los proyectos
    Proyecto: {
        id: ({ _id, id }) => _id || id, //id del objeto sera automaticamente el valor de _id
        progress: async ({ _id }, _, { db }) => {
            const avances = await db.collection("avances").find({ proyectoId: ObjectId(_id) }).toArray()
            const completed = avances.filter(todo => todo.isCompleted);
            if (avances.length === 0) {
                return 0;
            }
            return (completed.length / todos.length) * 100
        },

        users: async ({ userIds }, _, { db }) => Promise.all( //Función asincronica que se compromete a traer todos los usuarios relacionados con la tasklist 
            userIds.map((userId) => (
                db.collection('usuarios').findOne({ _id: userId })) //Consulta usuarios por Id
            )
        ),
        inscripciones: async ({_id}, _, {db})=>(
           await db.collection("inscripciones").find({proyectoId:ObjectId(_id)}).toArray()
         ),
        avances: async ({ _id }, _, { db }) => (
            await db.collection("avances").find({ proyectoId: ObjectId(_id) }).toArray()
        ),
    },


    //Parametros inmutables del avance
    Inscripcion: {
        id: (root) => {
            return root._id;
        },
        proyecto: async ({ proyectoId }, _, { db }) => (
            await db.collection("proyectos").findOne({ _id: ObjectId(proyectoId) })
        )
    },


    Avance: {
        id: (root) => {
            return root._id;
        },
        proyecto: async ({ proyectoId }, _, { db }) => (
            await db.collection("proyectos").findOne({ _id: ObjectId(proyectoId) })
        )
    },

}

const start = async () => {   //Iniciar Serviror
    const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME);

    const server = new ApolloServer({   //Contextos del servidor(necesarios)
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const user = await getUserFromToken(req.headers.authorization, db);
            //console.log(user)
            return {
                db,  //base de datos como contexto
                user,  //usuario autenticado como contexto
            }
        },
    });

    // Metodo listen, servidor iniciado
    server.listen().then(({ url }) => {
        console.log(`🚀  Servidor listo y corriendo en ${url}`);
    });
}
start();  //Arrancamos!


//Esquemas para GRAPHL vs MongoDB
const typeDefs = gql`   
  type Query {
    myProyectos: [Proyecto!]!
    myInscripciones: [Inscripcion]!
    myAvances: [Avance]!
    getProyecto(id: ID!): Proyecto
    getInscripcion(id:ID!): Inscripcion
    getAvance(id: ID!): Avance
  }
  
  type user{
      id: ID!
      mail: String!
      identificacion: String!
      nombre: String!
      password: String!
      rol: String!
      
      
  } 
  
  type proyectos{
      id: ID!
      nombreProyecto: String!
      objetivoGen: String!
      objetivoEsp: String!
      presupuesto: String!
      fechainicio: String!
      fechafin: String!
      estado: String!
      fase: String!
      user:[user!]!
  }
  type Inscripcion{
    id: ID!
    estadoInscripcion: String!
    fechaInscripcion: String!
    proyecto: Proyecto!
    user:[user!]!
  }
  
  type Avance{
    id: ID!
    descripAvance: String!
    observacion: String!
    fechaAvance: String!
    
}

  type Mutation{
    signUp(input:SignUpInput):AuthUser!
    signIn(input:SignInInput):AuthUser!
    updateUser(id:ID!, identificacion:String!, nombre:String!, estado:String!, password:String!):user!
    createProyecto(nombreProyecto: String!, objetivoGen: String!, objetivoEsp: String!
        presupuesto: String!, fechaFin: String!):Proyecto!
    updateProyecto(id:ID!, nombreProyecto: String!, objetivoGen: String!, objetivoEsp: String!
        presupuesto: String!, fechaFin: String!, estado:String!, fase:String!):Proyecto!
    deleteProyecto(id:ID!):Boolean!
    addUserToProyecto(proyectoId: ID!, userId: ID!): Proyecto
    createInscripcion(proyectoId:ID!): Inscripcion!
    updateInscripcion(id:ID!, estadoInscripcion:String!):Inscripcion!
    createAvance(descripAvance:String!, observacion:String!, inscripcionId:ID!):Avance!
    updateAvance(id:ID!,descripAvance:String, observacion: String!):Avance!
  }
  input SignUpInput{
    mail: String!
    identificacion: String!
    nombre: String!
    password: String!
    rol: String!
    
    
  }
  
  input SignInInput{
    mail: String!
    password: String!
  }
  type UpdateUser{
    id:ID!
    identificacion: String!
    nombre: String!
    estado: String! 
    password:String!
  }
  type AuthUser{
      user:user!
      token: String!
  }
  type Proyecto{
    id: ID!
    nombreProyecto: String!
    objetivoGen: String!
    objetivoEsp: String!
    presupuesto: String!
    fechaInicio: String!
    fechaFin: String!
    estado: String!
    fase: String!
    progress: Float!
    users: [user!]!
    inscripciones:[Inscripcion!]!
    avances:[Avance!]!
}
type Inscripcion{
    id: ID!
    estadoInscripcion: String!
    fechaInscripcion: String!
    proyecto: Proyecto!
    
}
type Avance{
    id: ID!
    descripAvance: String!
    observacion: String!
    fechaAvance: String!
   
    proyecto: Proyecto!
}
  `;