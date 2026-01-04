function Spinner() {
    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-50 flex justify-center items-center'>
            <div className='w-16 h-16 border-8 border-t-8 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
        </div>
    );
}

export default Spinner;
