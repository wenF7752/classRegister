class classModel {

    constructor() {
        this.classes = [];
        this.selectedClasses = [];
        this.credit = 0;
    }

    async fetchClasses() {

        this.classes = await API.getClasses();
        console.log(this.classes);
        return this.todos;
    }

    addClass(course) {
       
        this.selectedClasses.push(course);
        this.credit += course.credit;
      }

    deleteClass(course) {
        this.selectedClasses = this.selectedClasses.filter(c => c.courseId !== course.coursId);
        this.credit -= course.credit;
    }

    getCredit() {
        return this.credit;

    }
    getCourse(courseId) {  
        return this.classes.find(c => c.courseId === courseId);
      }

}


class classView {
    constructor() {
        this.unselectedClasses = document.querySelector('.unselected__classes');
        this.selectedClasses = document.querySelector('.selected__classes')
        this.totalCredit = document.querySelector('.total__credit');
        this.selectButton = document.querySelector('.select__button');
        this.clickClass = document.querySelector('.unselected__classes--class');
        

    }

    displayUnselectedClasses(classes) {
        this.unselectedClasses.innerHTML = classes.map(
            course => `<div class="unselected__classes--class" toggled="false" course-name="${course.courseName}" course-type="${course.required}" course-credit="${course.credit}"  course-id="${course.courseId}" >
            <p>${course.courseName}</p>
            <p>Course Type: ${course.required ? 'Compulsory' : 'Elective'}</p>
            <p>Course Credit: ${course.credit}</p>
    
            </div>`).join('');
    }
    
    displayselectedClasses(selectedClasses) {
        this.selectedClasses.innerHTML = selectedClasses.map(
            course => `<div class="unselected__classes--class" course-name="${course.courseName}" course-type="${course.required}" course-credit="${course.credit}"  course-id="${course.courseID}" >
            <p>${course.courseName}</p>
            <p>Course Type ${course.required}</p>
            <p>Course Credit: ${course.credit}</p>
    
            </div>`).join('');


    }

    updateTotalCredits(credit) {
        this.totalCredit.textContent = credit; 
    }


}


class classController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }


    init() {
        this.model.fetchClasses().then(() => {
            this.view.displayUnselectedClasses(this.model.classes);
        });

       
        this.unselectedClassesClickListener();
        this.selectButtonClickListener();
    }

    unselectedClassesClickListener() {
        this.view.unselectedClasses.addEventListener('click', (event) => {
          const target = event.target.closest('.unselected__classes--class');
          if (!target) return;
          const courseId = target.getAttribute('course-id');
          const course = this.model.getCourse(Number(courseId));
          
          if (course && this.model.credit + course.credit <= 18) {
            const isToggled = target.getAttribute('toggled') === 'true';
            target.setAttribute('toggled', !isToggled);
            target.style.backgroundColor = isToggled ? '' : 'aquamarine';
      
            if (isToggled) {
              this.model.deleteClass(course);
              this.view.updateTotalCredits(this.model.getCredit());
            } else {
              this.model.addClass(course);
              this.view.updateTotalCredits(this.model.getCredit());
            }
          } else if (this.model.selectedClasses.includes(course)) {
            this.model.deleteClass(course);
            target.setAttribute('toggled', 'false');
            target.style.backgroundColor = '';
            this.view.updateTotalCredits(this.model.getCredit());
          } else {
            alert("You have exceeded the maximum credit limit of 18");
          } 
        });
      }
      

      selectButtonClickListener() {
        this.view.selectButton.addEventListener('click', () => {
          const totalCredits = this.model.getCredit();
          const confirmed = confirm("You have chosen " + totalCredits +" credits for this semester. You cannot change once you submit. Do you want to confirm?");
          if (confirmed) {
            this.view.displayselectedClasses(this.model.selectedClasses);
          }
        });
      }
      
   



}


const app = new classController(new classModel(), new classView());