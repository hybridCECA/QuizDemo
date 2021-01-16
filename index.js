(function () {
    // Document variables
    const questions = document.getElementsByClassName("card");
    const answers = document.getElementsByClassName("answer");
    const textareas = document.getElementsByClassName("textarea");
    const numQuestions = questions.length;

    // Variables
    const answerList = [1, 3, 1, -1, 1];
    let submitted = false;
    let answered = 0;

    // Event handler for answers
    const handleAnswerClicked = (event) => {
        // Do nothing if already submitted
        if (submitted) {
            return;
        }

        // Deselect if already selected
        const classList = event.target.classList;
        if (classList.contains("answerSelected")) {
            event.target.classList.remove("answerSelected");
            updateInfo();
            return;
        }

        // Deselect other answers
        const answers = event.target.parentElement.parentElement.getElementsByClassName("answer");
        for (const answer of answers) {
            answer.classList.remove("answerSelected")
        }

        // Select this answer and update
        event.target.classList.add("answerSelected");
        updateInfo();
    }

    // Updates the infobar
    const updateInfo = () => {
        // Count answered textareas
        answered = 0;
        const textareas = document.getElementsByClassName("textarea");
        for (const textarea of textareas) {
            if (textarea.value.length > 0) {
                answered++;
            }
        }

        // Count multiple choice
        const selected = document.getElementsByClassName("answerSelected").length;
        answered += selected;

        // Update info
        document.getElementById("info").innerHTML = `${answered}/${numQuestions} Questions Answered`;
    }

    // Event handler for submit button
    const handleSubmit = () => {
        // Do nothing if already submitted
        if (submitted) {
            return;
        }

        submitted = true;

        // Disable and add results to textareas
        for (const textarea of textareas) {
            textarea.disabled = true;

            const result = document.createElement("div");
            result.classList.add("result");
            result.innerHTML = "Response has been recorded and will be graded"
            textarea.parentElement.appendChild(result);
        }
        
        // Grade multiple choice questions
        let questionNum = 0;
        let numGraded = 0;
        let numRight = 0;
        for (const question of questions) {
            const selections = question.getElementsByClassName("answer");
            if (selections.length === 0) {
                questionNum++;
                continue;
            }

            const result = document.createElement("div");
            result.classList.add("result");

            if (!selections[answerList[questionNum]].classList.contains("answerSelected")) {
                const selected = question.getElementsByClassName("answerSelected");
                if (selected.length > 0) {
                    const {classList} = selected[0];
                    classList.remove("answerSelected");
                    classList.add("answerWrong");

                    result.innerHTML = "Incorrect answer"
                } else {
                    for (const select of selections) {
                        select.classList.add("answerWrong");
                    }

                    result.innerHTML = "No answer selected"
                }
            } else {
                result.innerHTML = "Correct answer"
                numRight++;
            }

            // Add result and correct answer
            question.appendChild(result)
            selections[answerList[questionNum]].classList.add("answerRight");
            numGraded++;

            questionNum++;
        }

        document.getElementById("info").innerHTML = `Score: ${numRight}/${numGraded}`;
    }
    document.getElementById("submit").addEventListener("click", handleSubmit);

    // Initialization steps
    const initialize = () => {
        updateInfo();

        document.getElementById("quizName").innerHTML = document.title;

        // Add question labels
        let questionNum = 1;
        for (const question of questions) {
            const label = document.createElement("div");
            label.innerHTML = `Question ${questionNum++}`
            label.setAttribute("class", "question");

            question.insertBefore(label, question.firstChild);
        }

        // Register the answer event listeners
        for (const answer of answers) {
            answer.addEventListener("click", handleAnswerClicked);
            const newline = document.createElement("br");
            answer.parentElement.insertBefore(newline, answer);
        }

        // Register the textarea event listeners
        for (const textarea of textareas) {
            textarea.addEventListener("keyup", updateInfo);
            const newline = document.createElement("br");
            textarea.parentElement.insertBefore(newline, textarea);
        }
    }

    initialize();
})();