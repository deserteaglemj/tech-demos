import { COMPARE_ROWS } from '../data/compare'

export function CompareMatrix() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="matrix">
        <thead>
          <tr>
            <th scope="col">Dimension</th>
            <th scope="col">Paperclip</th>
            <th scope="col">Grok Bot</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.dimension}>
              <td>{row.dimension}</td>
              <td data-label="Paperclip">{row.paperclip}</td>
              <td data-label="Grok Bot">{row.grok}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
