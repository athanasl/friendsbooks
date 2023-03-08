import * as BookList from '../model/booklist_model.mjs' // version 3 with ORM sequelize, postgress
import { Book, User, BookUser} from '../model/bookList_seq_pg.mjs'
import {Op} from 'sequelize'

async function showBookList(req, res, next) {
    try {
        const myBooks = await BookList.loadBooks(req.session.username)
        res.render("booklist", { books: myBooks })

    } catch (error) {
        next(error)
    }
}

const addBook = async (req, res, next) => {
    try {
        await BookList.addBook({
            "title": req.body["newBookTitle"],
            "author": req.body["newBookAuthor"]
        }, req.session.username)
        next() //επόμενο middleware είναι το showBookList
    }
    catch (error) {
        next(error) //αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
    }
}

const deleteBook = async (req, res, next) => {
    
    const title = req.params.title;
    const username = req.session.username
    try {
        //const bookList = new BookList(req.session.username)
        await BookList.deleteBook({ title : title}, username )
        next() //επόμενο middleware είναι το BookController.showBookList
    }
    catch (error) {
        next(error)//αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
    }
}

const doaddcomment = async (req, res, next) => {
    //πάρε τον τίτλο
    const title1 = req.params.title;
    const username=req.session.username;

    //Βρές το όναμα του χρήστη στη Βάση
    try {
        const user=await User.findOne({    
            where: {
               name : username
            }
        }) 
        const onoma= user.name

        //βρές τον author tou book
        const book = await Book.findOne({    
            where: {
               title : title1
            }
        })    
        const title=book.title
        const author=book.author

       //βρές το comment tou user
        const mycomment = await BookUser.findOne({    
             where: {
                UserName : user.name,
                BookTitle : book.title 
            }
        })
        const comment1=mycomment.comment
        
        //βρές τα comments των άλλων για αυτό το βιβλίο Εξαιρώντας τον username απο τους άλλους 
        //και όσους έχουν comment=null ή κενο
        let kena=[]
        for(let i=0;i<100;i++){
            if(i==0) kena[0]=""
            else kena[i]=kena[i-1]+" "
        }
        const othersComments= await BookUser.findAll(
            {where :  
              {BookTitle : title1, 
                [Op.and]:[
                    {UserName:{[Op.ne]:username}},
                    {comment:{[Op.ne]:null}}, 
                    {comment:{[Op.notIn]:kena}}
                ]
              }
            },
            {row : true}
        )
        
        //στείλε τα παραπάνω δεδομένα στη ιστοσελίδα addcomment.hbs 
        res.render("addcomment", {title:title, author:author, comment:comment1, comments:othersComments})
       
        next() //επόμενο middleware είναι το BookController.showBookList    
    } 
    catch (error) {
        next(error)//αν έγινε σφάλμα, με το next(error) θα κληθεί το middleware με τις παραμέτρους (error, req, res, next)
    }
}

export { showBookList, addBook, deleteBook, doaddcomment}