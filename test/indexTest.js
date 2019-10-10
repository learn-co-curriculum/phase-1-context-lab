const helpers = require('./helpers')

describe("The payroll system", function () {
  describe("populates a record from an Array", function () {
    it("has a function called createEmployeeRecord", function () {
      expect(createEmployeeRecord).to.exist
    })

    describe("createEmployeeRecord", function () {
      it("populates a firstName field from the 0th element", function () {
        let testEmployee = createEmployeeRecord(["Gray", "Worm", "Security", 1])
        expect(testEmployee.firstName).to.eq("Gray")
      })

      it("populates a familyName field from the 1th element", function () {
        let testEmployee = createEmployeeRecord(["Gray", "Worm", "Security", 1])
        expect(testEmployee.familyName).to.eq("Worm")
      })

      it("populates a title field from the 2th element", function () {
        let testEmployee = createEmployeeRecord(["Gray", "Worm", "Security", 1])
        expect(testEmployee.title).to.eq("Security")
      })

      it("populates a payPerHour field from the 3th element", function () {
        let testEmployee = createEmployeeRecord(["Gray", "Worm", "Security", 1])
        expect(testEmployee.payPerHour).to.eq(1)
      })

      it("initializes a field, timeInEvents, to hold an empty Array", function () {
        let testEmployee = createEmployeeRecord(["Gray", "Worm", "Security", 1])
        expect(testEmployee.timeInEvents).to.eql([])
      })

      it("initializes a field, timeOutEvents, to hold an empty Array", function () {
        let testEmployee = createEmployeeRecord(["Gray", "Worm", "Security", 1])
        expect(testEmployee.timeOutEvents).to.eql([])
      })
    })
  })

  describe("process an Array of Arrays into an Array of employee records", function () {
    it("has a function called createEmployeeRecords", function () {
      expect(createEmployeeRecords).to.exist
    })

    describe("createEmployeeRecords", function () {
      let employeeRecords;

      let twoRows = [
        ["moe", "sizlak", "barkeep", 2],
        ["bartholomew", "simpson", "scamp", 3]
      ]

      it("its implementation makes use of of the createEmployeeRecord function", function(){
        let mySpy = chai.spy.on(window, "createEmployeeRecord")
        createEmployeeRecords([["Mister", "Matt", "Chief Awesomeness Offiser", 1000]])
        expect(mySpy).to.have.been.called()
      })

      it("creates two records", function () {
        let employeeRecords = createEmployeeRecords(twoRows)
        expect(employeeRecords.length).to.equal(2)
      })

      it("correctly assigns the first names", function () {
        let employeeRecords = createEmployeeRecords(twoRows)
        let nameExtractor = function (e) { return e.firstName }
        expect(employeeRecords.map(nameExtractor)).to.eql(["moe", "bartholomew"]);
      })
    })
  })

  describe("it adds a timeIn event Object to an employee's record of timeInEvents when provided an employee record and Date/Time String and returns the updated record", function () {
    it("has a function called createTimeInEvent", function () {
      expect(createTimeInEvent).to.exist
    })

    describe("createTimeInEvent", function () {
      let bpRecord, updatedBpRecord, newEvent

      it("creates the correct type", function () {
        let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
        let updatedBpRecord = createTimeInEvent.call(bpRecord, "2014-02-28 1400")
        let newEvent = updatedBpRecord.timeInEvents[0]
        expect(newEvent.type).to.equal("TimeIn")
      })

      it("extracts the correct date", function () {
        let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
        let updatedBpRecord = createTimeInEvent.call(bpRecord, "2014-02-28 1400")
        let newEvent = updatedBpRecord.timeInEvents[0]
        expect(newEvent.date).to.eq("2014-02-28");
      })

      it("extracts the correct hour", function () {
        let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
        let updatedBpRecord = createTimeInEvent.call(bpRecord, "2014-02-28 1400")
        let newEvent = updatedBpRecord.timeInEvents[0]
        expect(newEvent.hour).to.eq(1400);
      })
    })
  })

  describe("it adds a timeOut event Object to an employee's record of timeOutEvents when provided an employee record and Date/Time String and returns the updated record", function () {

    it("has a function called createTimeOutEvent", function () {
      expect(createTimeOutEvent).to.exist
    })

    describe("createTimeOutEvent", function () {
      let bpRecord, updatedBpRecord, newEvent

      it("creates the correct type", function () {
        let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
        let updatedBpRecord = createTimeOutEvent.call(bpRecord, "2015-02-28 1700")
        let newEvent = updatedBpRecord.timeOutEvents[0]
        expect(newEvent.type).to.equal("TimeOut")
      })

      it("extracts the correct date", function () {
        let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
        createTimeOutEvent.call(bpRecord, "2015-02-28 1700")
        let newEvent = bpRecord.timeOutEvents[0]
        expect(newEvent.date).to.eq("2015-02-28");
      })

      it("extracts the correct hour", function () {
        let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
        createTimeOutEvent.call(bpRecord, "2015-02-28 1700")
        let newEvent = bpRecord.timeOutEvents[0]
        expect(newEvent.hour).to.eq(1700);
      })
    })
  })

  describe("Given an employee record with a date-matched timeInEvent and timeOutEvent", function () {

    it("hoursWorkedOnDate calculates the hours worked when given an employee record and a date", function () {
      expect(hoursWorkedOnDate).to.exist
    })

    describe("hoursWorkedOnDate", function () {
      it("calculates that the employee worked 2 hours", function () {
        cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 1000])
        createTimeInEvent.call(cRecord, "44-03-15 0900")
        createTimeOutEvent.call(cRecord, "44-03-15 1100")
        expect(hoursWorkedOnDate.call(cRecord, "44-03-15")).to.equal(2)
      })
    })
  })

  describe("Given an employee record with a date-matched timeInEvent and timeOutEvent", function () {

    it("wagesEarnedOnDate multiplies the hours worked by the employee's rate per hour", function () {
      expect(wagesEarnedOnDate).to.exist
    })

    describe("wagesEarnedOnDate", function () {
      it("calculates that the employee earned 54 dollars", function () {
        cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 27])
        createTimeInEvent.call(cRecord, "44-03-15 0900")
        createTimeOutEvent.call(cRecord, "44-03-15 1100")
        expect(wagesEarnedOnDate.call(cRecord, "44-03-15")).to.equal(54)
      })

      it("uses hoursWorkedOnDate", function() {
        let mySpy = chai.spy.on(window, "hoursWorkedOnDate")
        cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 27])
        createTimeInEvent.call(cRecord, "44-03-15 0900")
        createTimeOutEvent.call(cRecord, "44-03-15 1100")
        wagesEarnedOnDate.call(cRecord, "44-03-15")
        expect(mySpy).to.have.been.called()
      })
    })
  })

  describe("Given an employee record with MULTIPLE date-matched timeInEvent and timeOutEvent", function () {

    it("allWagesFor aggregates all the dates' wages and adds them together", function () {
      expect(allWagesFor).to.exist
    })

    describe("allWagesFor", function () {
      it("calculates that the employee earned 378 dollars", function () {
        cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 27])
        // Earns 324
        createTimeInEvent.call(cRecord, "44-03-14 0900")
        createTimeOutEvent.call(cRecord, "44-03-14 2100")
        // Earns 54
        createTimeInEvent.call(cRecord, "44-03-15 0900")
        createTimeOutEvent.call(cRecord, "44-03-15 1100")
        // 324 + 54
        expect(allWagesFor.call(cRecord)).to.equal(378)
      })

      it("uses wagesEarnedOnDate", function() {
        let mySpy = chai.spy.on(window, "wagesEarnedOnDate")
        cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 27])
        createTimeInEvent.call(cRecord, "44-03-15 0900")
        createTimeOutEvent.call(cRecord, "44-03-15 1100")
        allWagesFor.call(cRecord)
        expect(mySpy).to.have.been.called()
      })
    })
  })

  describe("Given an array of multiple employees", function () {
    it("payrollExpense aggregates all the dates' wages and adds them together", function () {
      expect(calculatePayroll).to.exist
    })

    describe("payrollExpense", function () {
      it("calculates that the employees earned 770 dollars", function () {
        let rRecord = createEmployeeRecord(["Rafiki", "", "Aide", 10])
        let sRecord = createEmployeeRecord(["Simba", "", "King", 100])

        let sTimeData = [
          ["2019-01-01 0900", "2019-01-01 1300"], // 4 * 100 = 400
          ["2019-01-02 1000", "2019-01-02 1300"]  // 3 * 100 = 300 ===> 700 total
        ]

        let rTimeData = [
          ["2019-01-11 0900", "2019-01-11 1300"], // 4 * 10 = 40
          ["2019-01-12 1000", "2019-01-12 1300"]  // 3 * 10 = 40 ===> 70 total ||=> 770
        ]

        sTimeData.forEach(function (d) {
          let [dIn, dOut] = d
          createTimeInEvent.call(sRecord, dIn)
          createTimeOutEvent.call(sRecord, dOut)
        })

        rTimeData.forEach(function (d, i) {
          let [dIn, dOut] = d
          createTimeInEvent.call(rRecord, dIn)
          createTimeOutEvent.call(rRecord, dOut)
        })

        let grandTotalOwed = [sRecord, rRecord].reduce((m, e) => m + allWagesFor.call(e), 0)
        expect(grandTotalOwed).to.equal(770)
      })
    })
  })

  describe("runs payroll using the mock data provided by Ultron data systems", function () {
    describe("Dependent functions: createEmployeeRecords", function () {
      describe("takes CSV data, returns an array of employee records", function () {
        it("exists", function () {
          expect(createEmployeeRecords).to.exist
        })

        it("returns an Array with 2 records for Loki and Natalia", function () {
          let src = [
            ["Loki", "Laufeysson-Odinsson", "HR Representative", 35],
            ["Natalia", "Romanov", "CEO", 150]
          ]
          expect(createEmployeeRecords(src).length).to.eql(2)
          expect(createEmployeeRecords(src).map(function (e) {
            return e.firstName
          })).to.eql(["Loki", "Natalia"])
        })
      })
    })

    describe("Dependent functions: findEmployeeByFirstName(collection, firstNameString)", function () {
      it("exists", function () {
        expect(findEmployeeByFirstName).to.exist
      })

      it("finds \"Loki\" ", function () {
        let src = [
          ["Loki", "Laufeysson-Odinsson", "HR Representative", 35],
          ["Natalia", "Romanov", "CEO", 150]
        ]
        let emps = createEmployeeRecords(src)
        let loki = findEmployeeByFirstName(emps, "Loki")
        expect(loki.familyName).to.equal("Laufeysson-Odinsson")
      })
    })

    describe("Full Payroll Test", function () {
      /* Imported data courtesy of Ultron Consulting services
       *
       * Why go for smart when you can go for artificially intelligent? -- Ultron
       * Consulting
       */
      const csvDataEmployees = [
        ["Thor", "Odinsson", "Electrical Engineer", 45],
        ["Loki", "Laufeysson-Odinsson", "HR Representative", 35],
        ["Natalia", "Romanov", "CEO", 150],
        ["Darcey", "Lewis", "Intern", 15],
        ["Jarvis", "Stark", "CIO", 125],
        ["Anthony", "Stark", "Angel Investor", 300]
      ]

      const csvTimesIn = [
        ["Thor", ["2018-01-01 0800", "2018-01-02 0800", "2018-01-03 0800"]],
        ["Loki", ["2018-01-01 0700", "2018-01-02 0700", "2018-01-03 0600"]],
        ["Natalia", ["2018-01-03 1700", "2018-01-05 1800", "2018-01-03 1300"]],
        ["Darcey", ["2018-01-01 0700", "2018-01-02 0800", "2018-01-03 0800"]],
        ["Jarvis", ["2018-01-01 0500", "2018-01-02 0500", "2018-01-03 0500"]],
        ["Anthony", ["2018-01-01 1400", "2018-01-02 1400", "2018-01-03 1400"]]
      ]

      const csvTimesOut = [
        ["Thor", ["2018-01-01 1600", "2018-01-02 1800", "2018-01-03 1800"]],
        ["Loki", ["2018-01-01 1700", "2018-01-02 1800", "2018-01-03 1800"]],
        ["Natalia", ["2018-01-03 2300", "2018-01-05 2300", "2018-01-03 2300"]],
        ["Darcey", ["2018-01-01 1300", "2018-01-02 1300", "2018-01-03 1300"]],
        ["Jarvis", ["2018-01-01 1800", "2018-01-02 1800", "2018-01-03 1800"]],
        ["Anthony", ["2018-01-01 1600", "2018-01-02 1600", "2018-01-03 1600"]]
      ]

      describe("from several imported CSV structures", function () {
        let employeeRecords

        describe("calculatePayroll", function() {
          it("exists", function () {
            expect(calculatePayroll).to.exist
          })

          it("correctly sums the payroll burden to $11,880 when passed an array of employee records", function () {
            let employeeRecords = createEmployeeRecords(csvDataEmployees)
            employeeRecords.forEach(function (rec) {
              let timesInRecordRow = csvTimesIn.find(function (row) {
                return rec.firstName === row[0]
              })

              let timesOutRecordRow = csvTimesOut.find(function (row) {
                return rec.firstName === row[0]
              })

              timesInRecordRow[1].forEach(function(timeInStamp){
                createTimeInEvent.call(rec, timeInStamp)
              })

              timesOutRecordRow[1].forEach(function(timeOutStamp){
                createTimeOutEvent.call(rec, timeOutStamp)
              })
            }) 
            expect(calculatePayroll(employeeRecords)).to.eql(11880)
          })
        })
      })
    })
  })
})


