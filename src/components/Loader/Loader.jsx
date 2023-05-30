import { Spinner } from "react-bootstrap";

export function Loader({message}) {
    return (
        <div className="w-100 d-flex gap-3 justify-content-center align-items-center">
            <Spinner variant="primary" />
            {message}...
        </div>
    );
}