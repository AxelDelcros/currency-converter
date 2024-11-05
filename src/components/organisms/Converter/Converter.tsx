import Container from "../../atoms/Container/Container"

const Converter = () => {
  return (
    <div className="flex gap-6 text-white justify-center font-brand font-light">
      <Container label="Currency converter" className={"flex-1"}>
        Content
      </Container>
      <Container label="History" className={"flex-2"}>
        Content
      </Container>
    </div>
  )
}

export default Converter
