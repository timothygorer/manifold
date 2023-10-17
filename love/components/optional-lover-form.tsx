import { useState } from 'react'
import { set } from 'lodash'
import { updateLover } from 'web/lib/firebase/api'
import { Title } from 'web/components/widgets/title'
import { Col } from 'web/components/layout/col'
import clsx from 'clsx'
import { MultiCheckbox } from 'web/components/multi-checkbox'
import { Row } from 'web/components/layout/row'
import { Input } from 'web/components/widgets/input'
import { ChoicesToggleGroup } from 'web/components/widgets/choices-toggle-group'
import { Button } from 'web/components/buttons/button'
import { colClassName, labelClassName } from 'love/pages/signup'

export const OptionalLoveUserForm = () => {
  const [formState, setFormState] = useState({
    ethnicity: [],
    born_in_location: '',
    height_in_inches: 0,
    has_pets: false,
    education_level: '',
    photo_urls: [],
    pinned_url: '',
    religious_belief_strength: 0,
    religious_beliefs: [],
    political_beliefs: [],
  })
  const [heightFeet, setHeightFeet] = useState(0)

  const handleChange = (key: keyof typeof formState, value: any) => {
    setFormState((prevState) => set({ ...prevState }, key, value))
  }

  const [filePreviews, setFilePreviews] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Convert files to an array and take only the first 6 files
    const selectedFiles = Array.from(files).slice(0, 6)

    // Convert files to URLs for preview
    const fileURLs = selectedFiles.map((file) => URL.createObjectURL(file))

    // Update the state
    setFilePreviews(fileURLs)
    handleChange('photo_urls', fileURLs)
  }

  const handleSubmit = async () => {
    // Do something with the form state, such as sending it to an API
    const res = await updateLover({
      ...formState,
    }).catch((e) => {
      console.error(e)
      return false
    })
    if (res) {
      console.log('success')
    }
  }

  return (
    <>
      <Title>Optional questions</Title>
      <Col className={'gap-8'}>
        <Col className={clsx(colClassName)}>
          <label className={clsx(labelClassName)}>Upload some pics!</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple // Allows multiple files to be selected
            className={'w-52'}
          />
          <div className="flex gap-2">
            {filePreviews.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`preview ${index}`}
                className="h-20 w-20 object-cover"
              />
            ))}
          </div>
        </Col>

        <Col className={clsx(colClassName)}>
          <label className={clsx(labelClassName)}>
            What are your political beliefs?
          </label>
          <MultiCheckbox
            choices={{
              Libertarian: 'libertarian',
              Conservative: 'conservative',
              Liberal: 'liberal',
              Moderate: 'moderate',
              Anarchist: 'anarchist',
            }}
            selected={formState['political_beliefs']}
            onChange={(selected) => handleChange('political_beliefs', selected)}
          />
        </Col>

        <Col className={clsx(colClassName)}>
          <label className={clsx(labelClassName)}>How tall are you?</label>
          <Row className={'gap-2'}>
            <Col>
              <span>Feet</span>
              <Input
                type="number"
                onChange={(e) => setHeightFeet(Number(e.target.value))}
                className={'w-16'}
              />
            </Col>
            <Col>
              <span>Inches</span>
              <Input
                type="number"
                onChange={(e) =>
                  handleChange(
                    'height_in_inches',
                    Number(e.target.value) + heightFeet * 12
                  )
                }
                className={'w-16'}
              />
            </Col>
          </Row>
        </Col>

        <Col className={clsx(colClassName)}>
          <label className={clsx(labelClassName)}>Where were you born?</label>
          <Input
            type="text"
            onChange={(e) => handleChange('born_in_location', e.target.value)}
            className={'w-52'}
          />
        </Col>
        <Col className={clsx(colClassName)}>
          <label className={clsx(labelClassName)}>Do you have pets?</label>
          <ChoicesToggleGroup
            currentChoice={formState['has_pets']}
            choicesMap={{
              Yes: true,
              No: false,
            }}
            setChoice={(c) => handleChange('has_pets', c)}
          />
        </Col>

        <Col className={clsx(colClassName)}>
          <label className={clsx(labelClassName)}>
            What ethnicity/origin(s) are you?
          </label>
          <MultiCheckbox
            choices={{
              African: 'african',
              Asian: 'asian',
              Caucasian: 'caucasian',
              Hispanic: 'hispanic',
              'Middle Eastern': 'middle_eastern',
              'Native American': 'native_american',
              'Pacific Islander': 'pacific_islander',
              Other: 'other',
            }}
            selected={formState['ethnicity']}
            onChange={(selected) => handleChange('ethnicity', selected)}
          />
        </Col>

        <Col className={clsx(colClassName)}>
          <label className={clsx(labelClassName)}>
            What is the highest education level you've achieved?
          </label>
          <ChoicesToggleGroup
            currentChoice={formState['education_level']}
            choicesMap={{
              'High School': 'high-school',
              Bachelors: 'bachelors',
              Masters: 'masters',
              Doctorate: 'doctorate',
            }}
            setChoice={(c) => handleChange('education_level', c)}
          />
        </Col>
        <div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </Col>
    </>
  )
}