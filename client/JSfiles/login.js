document.getElementById("dob").max = new Date().toISOString().split("T")[0];
      function handleError(error, divId) {
        const errorMessageContainer = divId
        if (error) {
          errorMessageContainer.innerHTML = `<div class="alert alert-danger">${JSON.stringify(error)}</div>`;
        } else {
          errorMessageContainer.innerHTML = "";
        }
      }

      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const target = e.target;
        const data = {
          email: target.email.value,
          password: target.password.value,
        };
        try {
          const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            handleError(errorData.message, document.getElementById("errorMessageLogin"));
          } else {
            window.location.href = "/home";
          }
        } catch (error) {
          if (error instanceof SyntaxError) {
            console.error("There was a SyntaxError", error);
          } else {
            console.error("There was an error", error);
          }
        }
      };

      registrationForm.onsubmit = async (e) => {
        e.preventDefault();
        const target = e.target;
        const formData = new FormData();
        formData.append('firstName',target.firstName.value);
        formData.append('lastName', target.lastName.value);
        formData.append('email', target.email.value);
        formData.append('password', target.password.value);
        formData.append('dob', target.dob.value);
        formData.append('gender', target.gender.value);
        const userImgInput = target.querySelector('input[name="userImg"]');
        const userImgFile = userImgInput.files[0];
        formData.append('userImg', userImgFile);
        try {
          const response = await fetch("/auth/register", {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            handleError(errorData.message, document.getElementById("errorMessageRegister"));
          } else {
            window.location.href = "/home";
          }
        } catch (error) {
          console.error("There was an error", error);
        }
      };