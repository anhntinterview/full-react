// After every 3 seconds button will be removed disabled
export function handleSubmitBtn(
    submitBtnRef: React.RefObject<HTMLButtonElement>
) {
    submitBtnRef.current?.setAttribute('disabled', 'true');
    setTimeout(() => {
        submitBtnRef.current?.removeAttribute('disabled');
    }, 3000);
}
