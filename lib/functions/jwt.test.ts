import {generate,decoded} from "lib/functions/jwt"
import test from "ava"
test('jwt encode/decode', t => {
  const payload = {adrian:true}
  const token = generate(payload)
  const salida = decoded(token)
  delete salida.iat
	t.deepEqual(payload,salida);
});