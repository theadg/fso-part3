
const UserMessage = ({ message, isError = false }) => {
    if (!message) {
        return null;
    }

    const getClassName = () => {
        return !isError ? 'success' : 'success error' 
    }

    return (
        <div className={getClassName()}>
            {message}
        </div>
    )
}

export default UserMessage