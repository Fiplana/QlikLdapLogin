/**
 * Handles the login form.
 */
export class LoginFormController {
    /**
     * Register the event listener for the lögin form.
     */
    public static registerEventListeners(): void {
        const btn = document.getElementById("loginBtn");
        btn?.addEventListener("click", LoginFormController.onSubmit);
    }

    private static onSubmit(): void {
        const userName = document.getElementById("username") as HTMLInputElement;
        const pwInput = document.getElementById("username") as HTMLInputElement;
        fetch(window.location.origin + "/login", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userName.value,
                lastName: pwInput.value,
            }),
        })
            .then(async (response) => {
                const paresResponse = await response.json();
                if (paresResponse.err !== undefined) {
                    throw new Error(paresResponse.err);
                }
            })
            .catch(function (error) {
                const divErr = document.getElementById("errorDiv") as HTMLDivElement;
                divErr.innerHTML = "";
                const err = document.createElement("p");
                err.classList.add("errText");
                err.innerHTML = error.message;
                divErr.appendChild(err);
            });
    }
}
LoginFormController.registerEventListeners();
