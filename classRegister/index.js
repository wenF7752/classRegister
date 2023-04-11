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

    deleteClass(courseId) {
        const id = Number(courseId);
        this.selectedClasses = this.selectedClasses.filter(c => c.courseId !== id);
        const course = this.getCourse(Number(courseId));
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
        this.searchValue = document.querySelector('.search__input')


    }
    displaySearchValue(){
        // console.log("working")
        console.log("Logging for search input: ", this.searchValue.value)

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
            <p>Course Type: ${course.required}</p>
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


    async init() {
        await this.model.fetchClasses().then(() => {
            this.view.displayUnselectedClasses(this.model.classes);
        });


        this.unselectedClassesClickListener();
        this.selectButtonClickListener();
        this.updateSelectButtonState();
        this.searchEvent();
    }

    async unselectedClassesClickListener() {
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
                    this.model.deleteClass(courseId);
                    this.view.updateTotalCredits(this.model.getCredit());
                }else {
                    this.model.addClass(course);
                    this.view.updateTotalCredits(this.model.getCredit());
                }
                
                this.updateSelectButtonState()
            } else if (this.model.selectedClasses.includes(course)) {
                this.model.deleteClass(courseId);
                target.setAttribute('toggled', 'false');
                target.style.backgroundColor = '';
                this.view.updateTotalCredits(this.model.getCredit());
                this.updateSelectButtonState()
            } else {
                alert("You have exceeded the maximum credit limit of 18");
            }
        });
    }
    


    selectButtonClickListener() {
        this.view.selectButton.addEventListener('click', () => {
            const totalCredits = this.model.getCredit();

            const confirmed = confirm("You have chosen " + totalCredits + " credits for this semester. You cannot change once you submit. Do you want to confirm?");
            if (confirmed) {
                this.view.displayselectedClasses(this.model.selectedClasses);
            }
        });
    }

    updateSelectButtonState() {
        const requiredClasses = this.model.classes.filter(course => course.required).sort();
        const selectedRequiredClasses = this.model.selectedClasses.filter(course => course.required).sort();

        console.log(requiredClasses.length, selectedRequiredClasses.length)

        if (requiredClasses.length !== selectedRequiredClasses.length) {
            this.view.selectButton.setAttribute('disabled', 'true');
        } else {
            this.view.selectButton.removeAttribute('disabled');
        }
    }

    searchEvent(){

        this.view.searchValue.addEventListener("input", () => {
            const inputValue = this.view.searchValue.value.toLowerCase();
            console.log(inputValue);
            console.log(this.model.classes);
    
            const filteredClasses = this.model.classes.filter(course => {
                return course.courseName.toLowerCase().includes(inputValue);
            });
    
            this.view.displayUnselectedClasses(filteredClasses);
        });


    }



}


const app = new classController(new classModel(), new classView());

