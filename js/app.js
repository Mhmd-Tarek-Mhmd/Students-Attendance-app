const $ = document.querySelector.bind(document);

(function () {
  const Model = {
    days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    currentStudent: null,
    students: null,
    data: [
      {
        name: "Slappy the Frog",
        attendance: [
          true,
          false,
          true,
          false,
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          true,
        ],
      },
      {
        name: "Lilly the Lizard",
        attendance: [
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          false,
          false,
        ],
      },
      {
        name: "Paulrus the Walrus",
        attendance: [
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          true,
        ],
      },
      {
        name: "Gregory the Goat",
        attendance: [
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          true,
          false,
          true,
          false,
          false,
        ],
      },
      {
        name: "Adam the Anaconda",
        attendance: [
          true,
          false,
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          false,
        ],
      },
    ],

    getData: () => JSON.parse(localStorage.attendanceApp),
    saveData: function (obj) {
      localStorage.attendanceApp = JSON.stringify(obj);
    },
    add: function (student) {
      this.students.push(student);
      this.saveData(this.students);
    },

    init: function () {
      if (!localStorage.attendanceApp) {
        this.saveData(this.data);
        location.reload();
      } else {
        this.students = this.getData();
      }
    },
  };

  const Controller = {
    getDays: () => Model.days,
    getStudents: () => Model.students,
    addStudent: function (studentName) {
      const student = {
        name: studentName,
        attendance: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
      };

      Model.add(student);
      AdminView.render();
    },

    getCurrentStudent: () => Model.currentStudent,
    setCurrentStudent: function (studentIndex) {
      Model.currentStudent = this.getStudents()[studentIndex];
    },

    toggleAttendance: function (studentIndex, dayIndex) {
      this.setCurrentStudent(studentIndex);

      // Toggle day attendance
      const dayAttendance = this.getCurrentStudent().attendance[dayIndex];
      this.getCurrentStudent().attendance[dayIndex] = !dayAttendance;

      // Save new day attendance
      this.getStudents[studentIndex] = this.getCurrentStudent();
      Model.saveData(this.getStudents());

      TableView.render();
    },

    init: function () {
      Model.init();
      this.setCurrentStudent(0);
      TableView.init();
      AdminView.init();
    },
  };

  const TableView = {
    init: function () {
      /*
       ** Create days nodes
       */
      Controller.getDays().forEach((day) => {
        const span = document.createElement("span");
        span.textContent = day;
        $(".head .missed").before(span);
      });

      /*
       ** Create student nodes
       */
      Controller.getStudents().forEach((student) => {
        const studentAttendanceDays = student.attendance;
        const missedDays = studentAttendanceDays.filter((day) => !day);
        const studentName = student.name.toLowerCase().replaceAll(" ", "-");

        // [1] Create student container
        $(".table .body").innerHTML += `<div class="student ${studentName}">
          <div class="student-name">${student.name}</div>
          ${`<div class='attend'>
            <input type='checkbox' />
          </div>`.repeat(studentAttendanceDays.length)}
          <div class="missed">${missedDays.length}</div>
        </div>`;

        // [2] Check attended days
        studentAttendanceDays.forEach((day, dayIndex) => {
          const inputs = document.querySelectorAll(`.${studentName} input`);
          day && inputs[dayIndex].setAttribute("checked", "");
        });
      });

      // [3] Set an event listener for every input
      $(`.table .body`).addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "input") {
          const studentContainer = e.target.parentElement.parentElement;
          const studentChildren = Array.from(studentContainer.children);
          const students = Array.from(studentContainer.parentElement.children);

          const studentIndex = students.indexOf(studentContainer);
          const dayIndex = studentChildren.indexOf(e.target.parentElement) - 1;

          Controller.toggleAttendance(studentIndex, dayIndex);
        }
      });
    },

    render: function () {
      const student = Controller.getCurrentStudent();
      const missedDays = student.attendance.filter((day) => !day);
      const studentName = student.name.toLowerCase().replaceAll(" ", "-");

      $(`.${studentName} .missed`).innerHTML = missedDays.length;
    },
  };

  const AdminView = {
    init: function () {
      $(".admin > button").onclick = () => {
        $(".admin > div").classList.toggle("hide");

        const span = $(".admin > button span");
        span.textContent === "Open"
          ? (span.textContent = "Close")
          : (span.textContent = "Open");
      };

      $(".admin > div button").onclick = () => {
        const studentName = $(".admin > div input").value;
        studentName != "" && Controller.addStudent(studentName);
      };
    },

    render: function () {
      const student =
        Controller.getStudents()[Controller.getStudents().length - 1];
      const studentName = student.name.toLowerCase().replaceAll(" ", "-");
      const studentAttendanceDays = student.attendance.length;

      $(".table .body").innerHTML += `<div class="student ${studentName}">
        <div class="student-name">${student.name}</div>
        ${`<div class='attend'>
          <input type='checkbox' />
        </div>`.repeat(studentAttendanceDays)}
        <div class="missed">${studentAttendanceDays}</div>
      </div>`;
    },
  };

  Controller.init();
})();
