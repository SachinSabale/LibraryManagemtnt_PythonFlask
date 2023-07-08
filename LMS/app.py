from flask import Flask, render_template,Response, redirect, request, flash, jsonify
from flask_mysqldb import MySQL,MySQLdb
from datetime import date
import cv2

app = Flask(__name__)

app.secret_key = "caircocoders-ednalan"
       
app.config['MYSQL_HOST'] = 'localhost'   ############ host name
app.config['MYSQL_USER'] = 'root'        ############ user name
app.config['MYSQL_PASSWORD'] = ''        ############ password
app.config['MYSQL_DB'] = 'library_management' ####### db name
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)
########### Program start for book section #############################################

def starting_program():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT * FROM issue_book")
    myresult = cur.fetchall()
    book_id = ""
    for x in myresult:
        book_id = (x['id'])
        book_number = (x['book_number'])
    cur.execute("UPDATE issue_book SET book_price = %s WHERE id = %s", (book_number, book_id))
    mysql.connection.commit()
    cur.close()
        
    
@app.route('/')
def index():
    starting_program()
    return render_template('dashboard.html')

@app.route('/admin_dashboard')
def dashboard():
    starting_program()
    return render_template('dashboard.html')

@app.route('/manage_books')
def manage_books():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    result = cur.execute("SELECT * FROM book_section ORDER BY id")
    book_section = cur.fetchall()
    return render_template('manage_books.html', book_section=book_section)

@app.route('/manage_student')
def manage_student():
    return render_template('manage_student.html')

@app.route('/book_issue')
def book_issue():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    result = cur.execute("SELECT * FROM book_section WHERE available_status = 1")
    active_book_list = cur.fetchall()
    new_result = cur.execute("SELECT * FROM student_section WHERE student_status = 1")
    active_student_list = cur.fetchall()
    return render_template('issue_books.html', active_book_list=active_book_list, active_student_list=active_student_list)

@app.route('/return_books')
def return_books():
    return render_template('return_books.html')
 
@app.route("/new_book_registration",methods=["POST","GET"])
def new_book_registration():
    cursor = mysql.connection.cursor()
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        book_name = request.form['book_name']
        author_name = request.form['author_name']
        book_number = request.form['book_number']
        book_price = request.form['book_price']     
        book_stock = request.form['book_stock']    
        cur.execute("INSERT INTO book_section (book_name,author_name,book_number,book_price,book_stock) VALUES (%s,%s,%s,%s,%s)",[book_name,author_name,book_number,book_price,book_stock])
        mysql.connection.commit()       
        cur.close()
        msg = '1'   
    return jsonify(msg)
 
@app.route("/book_update",methods=["POST","GET"])
def ajax_update():
    cursor = mysql.connection.cursor()
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        book_id     = request.form['book_id']
        book_name   = request.form['book_name']
        author_name = request.form['author_name']
        book_number = request.form['book_number']
        book_price  = request.form['book_price']
        renew_stock = request.form['renew_stock']
        cur.execute("UPDATE book_section SET book_name = %s, author_name = %s, book_number = %s, book_price = %s, book_stock = %s WHERE id = %s ", [book_name, author_name, book_number, book_price, renew_stock, book_id])
        mysql.connection.commit()       
        cur.close()
        msg = '1'   
    return jsonify(msg)    
 
@app.route("/delete_book",methods=["POST","GET"])
def delete_book():
    cursor = mysql.connection.cursor()
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        getid = request.form['book_id']
        print(getid)
        cur.execute('DELETE FROM book_section WHERE id = {0}'.format(getid))
        mysql.connection.commit()       
        cur.close()
        msg = '1'   
    return jsonify(msg) 

@app.route("/book_by_id",methods=["POST","GET"])
def book_by_id():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        getid = request.form['book_id']
        result = cur.execute('SELECT * FROM book_section WHERE id = {0}'.format(getid))
        book_frm_pass = cur.fetchall()
    return jsonify({'htmlresponse': render_template('update_book_frm.html', book_frm_pass=book_frm_pass)})
    
@app.route("/booksearch",methods=["POST","GET"])
def booksearch():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        search_word = request.form['query']
        print(search_word)
        if search_word == "":
            query = "SELECT * from book_section ORDER BY id"
            cur.execute(query)
            book_section = cur.fetchall()
        else:    
            query = "SELECT * from book_section WHERE book_name LIKE '%{}%' OR author_name LIKE '%{}%' OR book_number LIKE '%{}%' OR id LIKE '%{}%' ORDER BY id DESC".format(search_word,search_word,search_word,search_word)
            cur.execute(query)
            book_section = cur.fetchall()
    return jsonify({'htmlresponse': render_template('book_table.html', book_section=book_section)})

########### Program end of book section / && start for student section ####################

@app.route("/new_student_registration",methods=["POST","GET"])
def new_student_registration():
    cursor = mysql.connection.cursor()
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        student_name        = request.form['student_name']
        student_email       = request.form['student_email']
        student_password    = request.form['student_password']
        student_contact     = request.form['student_contact'] 
        student_address     = request.form['student_address']        
        cur.execute("INSERT INTO student_section (student_name,student_email,student_password,student_contact,student_address) VALUES (%s,%s,%s,%s,%s)",[student_name,student_email,student_password,student_contact,student_address])
        mysql.connection.commit()       
        cur.close()
        msg = '1'   
    return jsonify(msg)

@app.route("/student_search",methods=["POST","GET"])
def student_search():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        search_word = request.form['query']
        print(search_word)
        if search_word == "":
            query = "SELECT * from student_section ORDER BY id"
            cur.execute(query)
            student_section = cur.fetchall()
        else:    
            query = "SELECT * from student_section WHERE student_name LIKE '%{}%' OR student_email LIKE '%{}%' OR student_contact LIKE '%{}%' OR id LIKE '%{}%' ORDER BY id DESC".format(search_word,search_word,search_word,search_word)
            cur.execute(query)
            student_section = cur.fetchall()
    return jsonify({'htmlresponse': render_template('student_table.html', student_section=student_section)})

@app.route("/delete_student",methods=["POST","GET"])
def delete_student():
    cursor = mysql.connection.cursor()
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        getid = request.form['student_id']
        cur.execute('DELETE FROM student_section WHERE id = {0}'.format(getid))
        mysql.connection.commit()       
        cur.close()
        msg = '1'   
    return jsonify(msg)

@app.route("/student_by_id",methods=["POST","GET"])
def student_by_id():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        getid = request.form['student_id']
        result = cur.execute('SELECT * FROM student_section WHERE id = {0}'.format(getid))
        student_frm_pass = cur.fetchall()
    return jsonify({'htmlresponse': render_template('update_student_frm.html', student_frm_pass=student_frm_pass)})

@app.route("/student_update",methods=["POST","GET"])
def student_update():
    cursor = mysql.connection.cursor()
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        student_id      = request.form['student_id']
        student_name    = request.form['student_name']
        student_email   = request.form['student_email']
        student_phone   = request.form['student_phone']
        security_key    = request.form['security_key']
        student_address = request.form['student_address']
        student_access  = request.form['student_access']
        cur.execute("UPDATE student_section SET student_name = %s, student_email = %s, student_contact = %s, student_password = %s, student_address = %s, student_status = %s WHERE id = %s ", [student_name, student_email, student_phone, security_key, student_address, student_access, student_id])
        mysql.connection.commit()       
        cur.close()
        msg = '1'   
    return jsonify(msg)

########### Program end of student section / && start for book issue section ####################

@app.route("/get_book_by_id",methods=["POST","GET"])
def get_book_details():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        getid = request.form['book_id']
        result = cur.execute('SELECT * FROM book_section WHERE id = {0}'.format(getid))
        book_details_frm_pass = cur.fetchall()
    return jsonify({'htmlresponse': render_template('get_book_details_by_id.html', book_details_frm_pass=book_details_frm_pass)})

@app.route("/book_issue_registration",methods=["POST","GET"])
def book_issue_registration():
    cursor = mysql.connection.cursor()
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        student_id    = request.form['student_id']
        book_id       = request.form['book_id']
        book_number   = request.form['book_number']
        book_price    = request.form['book_price'] 
        return_date   = request.form['return_date'] 
        stock_left    = request.form['stock_left']
        issue_date    = date.today()
    if cur.execute("INSERT INTO issue_book (student_id,book_id,book_number,book_price,return_date,issue_date) VALUES (%s,%s,%s,%s,%s,%s)",[student_id,book_id,book_number,book_price,return_date,issue_date]):
        cur.execute("UPDATE book_section SET book_stock = %s WHERE id = %s ", [stock_left,book_id])
        mysql.connection.commit()        
        cur.close()
        msg = '1'   
    return jsonify(msg)

@app.route("/issued_book_search",methods=["POST","GET"])
def issued_book_search():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        search_word = request.form['query']
        print(search_word)
        if search_word == "":
            query = "SELECT * from issue_book ORDER BY id"
            cur.execute(query)
            issue_book_table = cur.fetchall()
        else:    
            query = "SELECT * from issue_book WHERE student_id LIKE '%{}%' OR book_id LIKE '%{}%' OR book_number LIKE '%{}%' OR id LIKE '%{}%' ORDER BY id DESC".format(search_word,search_word,search_word,search_word)
            cur.execute(query)
            issue_book_table = cur.fetchall()
    return jsonify({'htmlresponse': render_template('book_issue_table.html', issue_book_table=issue_book_table)})

    ########### Program end of book issue section / && start for return book section ####################

@app.route("/return_book_search",methods=["POST","GET"])
def return_book_search():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if request.method == 'POST':
        search_word = request.form['query']
        print(search_word)
        if search_word == "":
            query = "SELECT * FROM issue_book LEFT JOIN student_section ON issue_book.student_id = student_section.id"
            cur.execute(query)
            return_book_table = cur.fetchall()
        else:    
            query = "SELECT * from issue_book WHERE student_id LIKE '%{}%' OR book_id LIKE '%{}%' OR book_number LIKE '%{}%' OR id LIKE '%{}%' ORDER BY id DESC".format(search_word,search_word,search_word,search_word)
            cur.execute(query)
            return_book_table = cur.fetchall()
    return jsonify({'htmlresponse': render_template('book_return_table.html', return_book_table=return_book_table)})


if __name__ == "__main__":
    app.run(debug=True)